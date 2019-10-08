<template>
  <div id="app">
    <!-- <div style='z-index:999' class="float-layer left-float-layer">
        <map-view/>
        <basemap/>
        <time-line/>

    </div>

    <div class="float-layer right-float-layer">
      
      <matrix
          width=550
          height=250
        
      />
      <histogram/>
      
    
    
    </div>   -->
    <basemap/>
    <histogram/>
    <selectBase/>
    <!-- <roseChart/> -->


  </div>

</template>

<script>

import DataProvider from './DataProvider';
import Basemap from './components/Basemap';
import histogram from './components/histogram'
import selectBase from './components/selectBase'
//import roseChart from './components/roseChart'

export default {
  name: 'App',
  components: {
    Basemap,
    histogram,
    selectBase,
    //roseChart,
  },
  data () {
    return {
      bubbleData: {}
    }
  },
}
  
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

.float-layer {
  position: absolute;
  z-index:998;
  width:25%;
  height:100%;

}

.left-float-layer{

  left:0px;
}

.right-float-layer{

  right:0px;
}


body {
    margin:0; 
    padding:0;
    width:100%;
    height:100%;
    background:white
}

.chart-name{
    color:white; 
    margin-bottom:30px;
    border-top: 3px solid #F0B04D;
    background: rgba(255,255,255,0.1);
    padding:10px;
}

.chart-name-right{

    float:right; 
    right:10px;
    margin: 0%;
  
}

.chart-name-left{

    float:left; 
    left:10px; 
    margin: 0%;

}

#tooltip{
		position:absolute;
		width:120;
		height:auto;
		font-family:serif;
		font-size:14px;
		text-align:left;
		border-style:solid;
		border-width:1px;
		background-color:white;
		border-radius:5px;
	}
</style>
