<template>
  <div class="home">
    <canvas class="webgl"></canvas>
    <div class="body">
      <div class="top">
        <p>
          header
        </p>
      </div>
      <div class="middle">
        <p>
          content
        </p>
      </div>
      <div class="bottom">
        <p>
          footer
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src
import * as THREE from "three";
import * as dat from "lil-gui";
import testVertexShader from '../shaders/test/vertex.glsl';
import testFragmentShader from '../shaders/test/fragment.glsl';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default defineComponent({
  name: 'HomeView',
  components: {
    // HelloWorld,
  },
  mounted(){
    console.log("test");
    console.log(THREE);
    console.log(dat);
    
    console.log(testVertexShader);
    console.log(testFragmentShader);
    this.init();
    
  },
  methods: {
    init(){
      const gui = new dat.GUI();

      // Canvas
      const canvas = document.querySelector("canvas.webgl");

      // Scene
      const scene = new THREE.Scene();


      /**
       * galaxy
       */

      //geometry
      const parameters:any = {};
      parameters.count = 200000;
      parameters.size = 0.005;
      parameters.radius = 5
      parameters.branches = 3
      parameters.spin = 1
      parameters.randomness = 0.2
      parameters.randomnessPower = 3
      parameters.insideColor = '#ff6030'
      parameters.outsideColor = '#1b3984'

      let geometry:any = null;
      let material:any = null;
      let points:any = null;

      const generateGalaxy = ()=>{
        if(points !== null){
          geometry.dispose();
          material.dispose();
          scene.remove(points);
        }

        /*
          geometry
        */
        geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(parameters.count * 3);
        const randomness = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);
        const scales = new Float32Array(parameters.count * 1);

        const insideColor = new THREE.Color(parameters.insideColor);
        const outsideColor = new THREE.Color(parameters.outsideColor);

        for(let i = 0; i < parameters.count; i++)
        {
            const i3 = i * 3

            // Position
            const radius = Math.random() * parameters.radius

            const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

            positions[i3    ] = Math.cos(branchAngle) * radius
            positions[i3 + 1] = 0
            positions[i3 + 2] = Math.sin(branchAngle) * radius
        
            randomness[i3    ] = randomX
            randomness[i3 + 1] = randomY
            randomness[i3 + 2] = randomZ

            // Color
            const mixedColor = insideColor.clone()
            mixedColor.lerp(outsideColor, radius / parameters.radius)

            colors[i3    ] = mixedColor.r
            colors[i3 + 1] = mixedColor.g
            colors[i3 + 2] = mixedColor.b

            // Scale
            scales[i] = Math.random()
        }

        geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
        geometry.setAttribute('aRandomness',new THREE.BufferAttribute(randomness,3));
        geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
        geometry.setAttribute('aScale',new THREE.BufferAttribute(scales,3));
        //material
        material = new THREE.ShaderMaterial({
          depthWrite:false,
          blending:THREE.AdditiveBlending,
          vertexColors:true,
          vertexShader:testVertexShader,
          fragmentShader:testFragmentShader,
          uniforms:
          {
            uTime:{value:0},
            uSize:{value:30*renderer.getPixelRatio()}
          }
        });

        points = new THREE.Points(geometry,material);
        scene.add(points);
      }

      gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
      gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
      gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
      gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
      gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
      gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
      gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)


      /*
        light
      */
      // const ambientLight = new THREE.AmbientLight();
      // ambientLight.color = new THREE.Color("#fff");
      // ambientLight.intensity = 0.5;
      // scene.add(ambientLight);
      // const directionalLight = new THREE.DirectionalLight('#ffffff',3);
      // directionalLight.castShadow = true;
      // directionalLight.shadow.camera.far = 15;
      // directionalLight.shadow.mapSize.set(1024,1024);
      // directionalLight.shadow.normalBias = 0.05;
      // directionalLight.position.set(0.25,3,-2.25);
      // scene.add(directionalLight);

      // gui.add(directionalLight,'intensity').min(0).max(10).step(0.001).name('lightIntensity');
      // gui.add(directionalLight.position,'x').min(-5).max(5).step(0.001).name('lightX');
      // gui.add(directionalLight.position,'y').min(-5).max(5).step(0.001).name('lightY');
      // gui.add(directionalLight.position,'z').min(-5).max(5).step(0.001).name('lightZ');
      /**
       * Sizes
       */
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      window.addEventListener("resize", () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        
        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        
        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      });


      /**
       * Camera
       */
      // Base camera
      const camera = new THREE.PerspectiveCamera(
        75,
        sizes.width / sizes.height,
        0.1,
        100
      );
      camera.position.set(3,3,3);
      scene.add(camera);

      // Controls
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;

      /**
       * Renderer
       */
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
      });
      renderer.shadowMap.enabled = true;
      // renderer.shadowMap.type = THREE.PCFShadowMap;
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


      generateGalaxy();
      /**
       * Animate
       */
      const clock = new THREE.Clock();
      let previousTime = 0;
      const tick = () => {
        
        const elapsedTime = clock.getElapsedTime();

        const deltaTime = elapsedTime-previousTime;
        material.uniforms.uTime.value = elapsedTime;
        previousTime = elapsedTime;



        // Update controls
        controls.update();

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
      };

      tick();

    }
  },
});
</script>
<style lang="less" scoped>
.home{
  color: #fff;
  width: 100%;
  canvas{
    position: fixed;
    z-index: -1;
  }
  .body{
    position: relative;
    width: 1200px;
    background-color: rgba(238, 179, 189,0.1);
    margin: 0 auto;
    .top{
      position: fixed;
      width: 1200px;
      height: 150px;
      // background-color: skyblue;
      opacity: 0.1;
    }
    .middle{
      position: relative;
      padding-top: 150px;
      height: 2000px;
      // background-color: antiquewhite;
    }
    .bottom{
      height: 200px;
      // background-color: bisque;
    }
  }
}
</style>