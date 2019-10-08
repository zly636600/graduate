<template>
<div class='roseChart-chart-container'>
      <!-- <div class='chart-name chart-name-right'>{{name}}</div> -->
      <div v-bind:id='id' class='roseChart-container'>
   
      </div>
  </div>
</template>

<script>

const d3 = require('d3');
//var plotly = require('plotly')('username','apiKey');

import * as dsv from 'd3-dsv'

import $ from 'jquery';

import DataProvider from '../DataProvider';
// import React from 'react';
// import Plot from 'react-plotly.js';

const props = {
  id: {
    type: String,
    default: () => 'selectBase-chart-container',
  },
//   name:{
//     type: String,
//     default: () => '直方图',
//   },
  top:{
    type: Number,
    default: () => 30,
  },
  left:{
    type: Number,
    default: () => 20,
  },
  width:{
    type: Number,
    default: () => 400,
  },
  height:{
    type:Number,
    default: () => 200,
  }

};
export default {
    
    name:'selectBase-chart',
    props,
    mounted:function(){

        d3.select(d3.select('#' + this.id).node().parentNode)
                .style('top', this.top + 'px')
                .style('left', this.left + 'px')

        this.$root.$on('rose_data', (arr) => {
            this.rose_data =arr	
             //this.chartInit(this.sel_base_data)
            //console.log(this.rose_data)
            this.roseInit(this.rose_data);
        })
          
        
    },

    watch:{

    },

    methods:{

      roseInit(){

        var roseChart_container = d3.select('#' + this.id)		//matrix_container	
										.append("svg")		
										.attr("width", this.width)	
                    .attr("height", this.height);

        var dict = {}
        for(var i=0;i<this.rose_data.length;i++){
          let key = this.rose_data[i].hour;
          if(dict[key]==undefined){
            dict[key] = [];
            dict[key].push(this.rose_data[i].week)
          }
          else{
            dict[key].push(this.rose_data[i].week)
          } //时间为key，星期为value组成字典

        }

        var arr = [];
        for(let key in dict){             //遍历字典，统计每个元素中星期的数量，重新形成数组arr

          var mon=0
          var tus=0
          var wed=0
          var thur=0
          var fri=0
          var sat=0
          var sun=0

          for(let i=0;i<dict[key].length;i++){
            
            
            if(dict[key][i]==1){
              mon++;
            }
            else if(dict[key][i]==2){
              tus++;
            }
            else if(dict[key][i]==3){
              wed++;
            }
            else if(dict[key][i]==4){
              thur++;
            }
            else if(dict[key][i]==5){
              fri++;
            }
            else if(dict[key][i]==6){
              sat++;
            }
            else if(dict[key][i]==7){
              sun++;
            } 
            
          }
          
          arr.push({"hour":parseInt(key),"mon":mon,"tus":tus,"wed":wed,"thur":thur,"fri":fri,"sat":sat,"sun":sun})
          
        }
        console.log(arr)

        for(var i = 0;i<24;i++){
          var add_ele = {"hour":i,"mon":0,"tus":0,"wed":0,"thur":0,"fri":0,"sat":0,"sun":0}
          if(arr[i]==undefined){
            arr.push(add_ele)
          }
          else if(arr[i].hour!=i){
            arr.splice(i,0,add_ele)
          }
        }

        // var data_mon = [],data_tus = [],data_wed = [],data_thur = [],data_fri = [],data_sat = [],data_sun = [];
        // arr.forEach(d=>{
        //   data_mon.push(d.mon*3)
        //   data_tue0.push(d.tus*3)
        //   data_wed0.push(d.wed*3)
        //   data_thur0.push(d.thur*3)
        //   data_fri0.push(d.fri*3)
        //   data_sat0.push(d.sat*3)
        //   data_sun0.push(d.sun*3)
        // })

        // var data_tue = data_mon.map(function(value,index){return value +data_tus0[i]});
        // var data_wed = data_tue.map(function(value,index){return value+data_wed0[i]});
        // var data_thur = data_wed.map(function(value,index){return value+data_thur0[i]});
        // var data_fri = data_thur.map(function(value,index){return value+data_fri0[i]});
        // var data_sat = data_fri.map(function(value,index){return value+data_sat0[i]});
        // var data_sun = data_sat.map(function(value,index){return value+data_sun0[i]});
        // var data_mon0 = data_mon.slice(0,6),
        // data_mon1 = data_mon.slice(6,12),
        // data_mon2 = data_mon.slice(12,18),
        // data_mon3 = data_mon.slice(18,24),
        // data_tus0 = data_tus.slice(0,6),
        // data_tus1 = data_tus.slice(6,12),
        // data_tus2 = data_tus.slice(12,18),
        // data_tus3 = data_tus.slice(18,24),
        // data_wed0 = data_wed.slice(0,6),
        // data_wed1 = data_wed.slice(6,12),
        // data_wed2 = data_wed.slice(12,6),
       
//         var time_data0 = ["00:00","01:00","02:00","03:00","04:00","05:00"],
//         time_data1 = ["06:00","07:00","08:00","09:00","10:00","11:00"],
//         time_data2 = ["12:00","13:00","14:00","15:00","16:00","17:00"],
//         time_data3 = ["18:00","19:00","20:00","21:00","22:00","23:00"]
  
// //0~5时刻星期天
//         var trace1 = {
//           r:data_sun.slice(0,6),
//           t:time_data0,
//           name:"sunday",
//           marker:{color:'rgb(106,81,163)'},
//           type:'area'
//         };
// //0~5时刻星期六
//         var trace2 = {
//           r:data_sat.slice(0,6),
//           t:time_data0,
//           name:"saturday",
//           marker:{color:'rgb(106,81,163)'},
//           type:'area'
//         };
// //0~5时刻星期五
//         var trace3 = {
//           r:data_fri.slice(0,6),
//           t:time_data0,
//           name:"friday",
//           marker:{color:'rgb(106,81,163)'},
//           type:'area'
//         };
// //0~5时刻星期四
//         var trace4 = {
//           r:data_thur.slice(0,6),
//           t:time_data0,
//           name:"thursday",
//           marker:{color:'rgb(106,81,163)'},
//           type:'area'
//         };
// //0~5时刻星期三
//         var trace5 = {
//           r:data_wed.slice(0,6),
//           t:time_data0,
//           name:"wednesday",
//           marker:{color:'rgb(106,81,163)'},
//           type:'area'
//         };
// //0~5时刻星期二
//         var trace6 = {
//           r:data_tue.slice(0,6),
//           t:time_data0,
//           name:"tuesday",
//           marker:{color:'rgb(106,81,163)'},
//           type:'area'
//         };
// //0~5时刻星期一
//         var trace7 = {
//           r:data_mon.slice(0,6),
//           t:time_data0,
//           name:"monday",
//           marker:{color:'rgb(106,81,163)'},
//           type:'area'
//         };

//          var data = [trace1, trace2, trace3, trace4,trace5,trace6,trace7];

// var layout = {
//   title: 'Wind Speed Distribution in Laurel, NE',
//   font: {size: 16},
//   legend: {font: {size: 16}},
//   radialaxis: {ticksuffix: '%'},
//   orientation: 270
// };

// Plotly.newPlot('myDiv', data, layout, {showSendToCloud: true}); 



        

        

      }

        
        }

    
}
</script>
<style lang="css">


.selectBase-chart-container{
  
  position:absolute;
}


</style>







