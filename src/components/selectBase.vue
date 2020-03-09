<template>
<div class='selectBase-chart-container' id="barcontrole">
      <!-- <div class='chart-name chart-name-right'>{{name}}</div> -->
      <div v-bind:id='id' class='selectBase-container'>
   
      </div>
 


  </div>
</template>

<script>

const d3 = require('d3');
const dat = require('dat.gui')

import * as dsv from 'd3-dsv'


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
                // .style('top', this.top + 'px')
                // .style('left', this.left + 'px')

       

        this.$root.$on('base_data',(basedata)=>{
           this.$root.$on('AreaData', (areadata) => {
             this.area_data = areadata	
             this.base_data = basedata 
             this.selectBaseChartInit(this.base_data,this.area_data);

            })                 
        })  
        
        
    },

    watch:{

    },

    methods:{

        selectBaseChartInit(base,area){
          var bili = [[99/100,1/100],[9/10,1/10],[1/2,1/2],[1/10,9/10],[1/100,99/100]];//base_area scale  
          //creat slider
        var sliders = new function(){
          this.value = 2;
          this.test = 1
        }
        var gui = new dat.GUI({ autoPlace: false });
        var customContainer = document.getElementById('barcontrole');
        customContainer.appendChild(gui.domElement);

        var valueslider = gui.add(sliders,'value',0,4).step(1)
        gui.add(sliders,'test')
        console.log(sliders.value)




          
          var selectBase_container = d3.select('#' + this.id)
          
                //matrix_container	
                
          var selectBase_container = d3.select('#' + this.id)
										.append("svg")		
										.attr("width", this.width)	
                    .attr("height", this.height);

          var th = this;
          function render_arr(){      
             th.base_data.forEach(d => {
                d.count = parseInt(d.count);
                d.hour = parseInt(d.HOUR)
            });
            //console.log(this.base_data)

            let data = d3.nest()
            .key(function(d){return d.key})
            .rollup(function(v){return d3.sum(v,function(d){return d.count;})/48})
            .entries(th.base_data)  
            //console.log(data)

            
            for(let i = 0;i<th.area_data.length;i++){
              let asd = th.area_data[i].key;
              th.area_data[i].aver = data[i].value;
            }
            //console.log(this.area_data)

            let AreaMax = d3.max(th.area_data,function(d){return d.area})
            let AreaMin = d3.min(th.area_data,function(d){return d.area})
            let AverMax = d3.max(th.area_data,function(d){return d.aver})
            let AverMin = d3.min(th.area_data,function(d){return d.aver})

            let arr = [];
           th.area_data.forEach(d=>{
             d.area = (d.area-AreaMin)/(AreaMax-AreaMin)
             d.aver = (d.aver-AverMin)/(AverMax-AreaMin)
             arr.push(Math.sqrt((bili[sliders.value][0]*d.area+bili[sliders.value][1]*d.aver)/2)*50)
             //arr.push(d.aver*50)
           })
           return arr;
        }
        let arr = render_arr();
           //console.log(d3.min(arr),d3.max(arr))

            // let arr = [];
            // for(var key in data){
            //   arr.push(data[key].value)
            // }

            //console.log(arr)
                      
            var xAxisWidth = 400;
            
            var padding = {top:35, right:35, bottom:35, left:35};
            
            //定义x轴比例尺			
            let x = d3.scaleLinear()
                .domain(d3.extent(arr)).nice()
                .range([0,xAxisWidth])

            let ticks = [], step = 1

            for (let i =0;i<36;i+=step){

              ticks.push(i)
            }

            var histogram = d3.histogram()  //直方图布局
                              .domain(x.domain())
                              .thresholds(ticks)

            var hisData = histogram(arr)   
            
            //console.log(hisData)
            
            console.log(hisData)
            
            var xTicks = hisData.map(function(d){return d.x0})

            //console.log(d3.extent(hisData, d => d.x0))

            var xScale = d3.scaleLinear()
                        //.domain(d3.extent(hisData, d => d.x0))
                        .domain([0,36])
                        .range([padding.left,xAxisWidth-padding.right])
                        //.padding(0.1);

            var yAxisWidth = 150;
            var yScale = d3.scaleLinear()
                            .domain([d3.min(hisData,function(d){return d.length;}),d3.max(hisData,function(d){return d.length;}) ])
                            .range([yAxisWidth-padding.bottom,padding.top]);
            //绘制x轴					
            var xAxis = d3.axisBottom()
                        .scale(xScale)
                        //.tickValues(xScale.domain())
                        .ticks(20)
                        .tickFormat(d3.format(".0f"));
                        
            selectBase_container.append("g")
                .attr("class","axis")
                .attr("transform","translate("+0+","+(yAxisWidth - padding.bottom)+")")
                .call(xAxis);
            //绘制y轴	
            var yAxis = d3.axisLeft()
                        .scale(yScale)
                        .ticks(4)
                        .tickFormat(d3.format(".0f"));
            
            selectBase_container.append("g")
                .attr("class","axis")
                .attr("transform","translate("+padding.left+","+0+")")
                .call(yAxis)

            // selectBase_container.selectAll('.axis').selectAll('path').attr('stroke','white')
			      // selectBase_container.selectAll('.axis').selectAll('line').attr('stroke','white')
			      // selectBase_container.selectAll('.axis').selectAll('text').attr('fill','white')
                
                
            var hisRect = selectBase_container.append("g")
                            .style("opacity",0.5);
                            
            hisRect.selectAll("rect")
                    .data(hisData)
                    .enter()
                    .append("rect")
                    .attr("class","rect") 
                    .attr("x",function(d,i){
                        return xScale(d.x0);
                    })
                    .attr("y", d => yScale(d.length))
                    .attr("width", 7)
                    // .attr("width",function(d,i){
                    //     return xScale.bandwidth();
                    // })
                    .attr("height", d => yScale.range()[0]-yScale(d.length))
                    .attr("fill","steelblue") //横坐标重要程度 纵坐标个数
            

            valueslider.onChange(function(){
                let arr = render_arr();
                hisData = histogram(arr)
              console.log("aa");
                 hisRect.selectAll("rect").remove();
            hisRect.selectAll("rect")
                    .data(hisData)
                    .enter()
                    .append("rect")
                    .attr("class","rect") 
                    .attr("x",function(d,i){
                        return xScale(d.x0);
                    })
                    .attr("y", d => yScale(d.length))
                    .attr("width", 7)
                    // .attr("width",function(d,i){
                    //     return xScale.bandwidth();
                    // })
                    .attr("height", d => yScale.range()[0]-yScale(d.length))
                    .attr("fill","steelblue")

            })



            var brush_width = this.width - padding.left - padding.right+40;
            var brush_height = this.height - padding.top - padding.bottom-35.;
            let that = this;
        
            var brush = d3.brushX()
            .extent([[0,0],[brush_width,brush_height]])
            .on("end", d=>{

              //console.log(d)
                var ext = d3.event.selection.map(xScale.invert)
                //console.log(ext)
                let x0 = ext[0];
                let x1 = ext[1];
                //console.log(x0,x1)
                let indexValue = [];
                for(let i = 0;i<arr.length;i++){
                  if(arr[i]>=x0 && arr[i]<=x1){
                    indexValue.push(i)
                  }
                }
                let selPoly = []
                for(let j = 0;j<indexValue.length;j++){
                  let indexNumber = indexValue[j];
                  if(that.area_data[indexNumber].polyg){
                    let polyData = that.area_data[indexNumber].polyg
                    //console.log(polyData)
                    selPoly.push(polyData.data.key)
                  }
                
                }
                that.$root.$emit('selPoly', selPoly)
                //console.log(selPoly)
            })
            var brushg = selectBase_container.append("g")
            .attr("class", "brush")
            .call(brush)

            brushg.selectAll("rect")
            .attr("height", brush_height)
            .attr("opacity", 0.3)
            .attr("transform", "translate(" + 0 + "," + padding.bottom + ")")

          //  let i1 = arr.indexValue(this.x0)
          //  let i2 = arr.indexValue(this.x1)
          //  console.log(i1,i2)
           
        }

    },
}
</script>
<style lang="css">

element.style{
  top:0% !important;
}

.selectBase-chart-container{
  position:absolute;
  top: 1%;
  left: 0%;
  width: 20%;
  height: 70%;

  border:1px solid rgba(0, 0, 0, 0.6);
  /* border-radius: 0.3em;
    box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.3) inset,
  ;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px); */
}
#selectBase-chart-container{
  position:absolute;
  top: 10%;
  left: 1%
}
#barcontrole .dg{
  position: absolute;
  left: 1%;
  top: 1%;

}
.dg.ac{
  position: fixed;
    top: 1%;
    left: 0;
    right: auto;
    height: 0;
    z-index: 0;
}

</style>