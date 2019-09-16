<template>
<div class='roseChart-chart-container'>
      <!-- <div class='chart-name chart-name-right'>{{name}}</div> -->
      <div v-bind:id='id' class='roseChart-container'>
   
      </div>
  </div>
</template>

<script>

const d3 = require('d3');

import * as dsv from 'd3-dsv'

import $ from 'jquery';

import DataProvider from '../DataProvider';

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

        // var selectBase_container = d3.select('#' + this.id)		//matrix_container	
				// 						.append("svg")		
				// 						.attr("width", this.width)	
        //             .attr("height", this.height);

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
          arr.push({"hour":key,"mon":mon,"tus":tus,"wed":wed,"thur":thur,"fri":fri,"sat":sat,"sun":sun})
          
        }
       console.log(arr)
        

      }

        
        }

    
}
</script>
<style lang="css">


.selectBase-chart-container{
  
  position:absolute;
}


</style>







