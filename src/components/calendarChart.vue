<template>
 <div class='calendar-chart-container'>
      <!-- <div class='chart-name chart-name-right'>{{name}}</div> -->
      <div v-bind:id='id' class='calendar-container'>
   
      </div>
  </div>   
</template>



<script>

const d3 = require('d3');

const props = {
    id:{
        type: String,
        default: () => 'calendar-chart-container',
    },
    // name:{
    //     type:String,
    //     default: () => '日历图',
    // },
    bottom:{
        type:Number,
        default: () => 30,
    },
    right:{
        type:Number,
        default: () => 30,
    },
    width:{
        type:Number,
        default: () => 420,
    },
    height:{
        type:Number,
        default: () => 170,
    },
};



export default {
    name:'calendar-chart',
    props,
    // dom渲染完成后执行
    mounted:function(){
        d3.select(d3.select('#' + this.id).node().parentNode)
                .style('bottom', this.bottom + 'px')
                .style('right', this.right + 'px')

        this.$root.$on('rose_data', (arr) => {
            this.calendar_data = arr;
    //  [[0,0,1,1,2,2,3,3,4,4,4,4,3,3,2,2,1,1,2,2,4,4,3,3],
    //   [0,0,4,4,2,2,3,3,4,4,3,3,2,2,4,4,1,1,2,2,1,1,3,3],
    //   [0,0,2,2,3,1,1,3,4,3,2,4,4,4,3,2,1,1,2,2,4,4,3,3],
    //   [0,0,1,1,2,1,3,2,3,3,4,4,4,4,3,3,2,2,1,1,2,2,4,3],
    //   [0,0,1,2,2,3,3,4,3,4,4,4,3,3,2,2,1,1,2,2,4,4,3,3],
    //   [0,0,1,1,2,2,3,3,0,4,1,4,3,3,2,0,1,1,2,1,4,2,3,3],
    //   [0,0,3,1,2,2,3,3,4,1,0,4,3,2,2,2,1,3,1,2,4,2,2,3]]
             this.chartInit(this.calendar_data)
       }) 

    },

    watch:{

    },
    methods:{

        chartInit(data){
            // console.log(data)

            
            var calendar_container = d3.select('#'+this.id)
                                        .append("svg")
                                        .attr("width",this.width)
                                        .attr("height",this.height);

        var dict = {}
        for(var i=0;i<this.calendar_data.length;i++){
          let key = this.calendar_data[i].week;
          if(dict[key]==undefined){
            dict[key] = [];
            dict[key].push(this.calendar_data[i].hour)
          }
          else{
            dict[key].push(this.calendar_data[i].hour)
          } //星期为key，小时为value组成字典

        }
        var caldata = [];
        for(var i=0;i<7;i++){
            caldata[i] = [];
            for(var j=0;j<24;j++)
                caldata[i][j]=0;
        } 
        var max=0;
        for(var i=0;i<this.calendar_data.length;i++){
            
            caldata[data[i].week-1][data[i].hour]++;
            if(max < caldata[data[i].week-1][data[i].hour]) max =caldata[data[i].week-1][data[i].hour]
        }
            
        data = caldata;


            var rectNum = 24;
            var rangeMin = 0;
            var rangeMax = 24;
            var xAisWidth = 400;
            var yAisHeight = 180;
            var n = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
            var padding = {top:30, right:30, bottom:30, left:30};

            var g1 = calendar_container.append("g")
            var g2 = calendar_container.append("g")   

            var colorlinear = d3.scaleLinear()
                                .domain([0,max])
                                .range([0,1])
            var palegreen = d3.rgb(144,180,210);    
            var darkgreen = d3.rgb(106,17,21);                  
            var color = d3.interpolate(palegreen,darkgreen); 

            var xScale = d3.scaleLinear()
                        .domain([rangeMin,rangeMax])
                        .range([padding.left,xAisWidth-padding.right])


            var yScale = d3.scaleLinear()
                            .domain([0,7])
                            .range([padding.top,yAisHeight-padding.bottom])

             g1.selectAll("text")
                        .data(n)
                        .enter()
                        .append("text")
                        .text(function(d){
                            return (d);
                        })
                        .attr("x",padding.left)
                        .attr("y",function(d,i){
                            return (padding.top+(yAisHeight-padding.bottom-padding.top)/7*i)+10;
                        })
                        .attr("font-size",'15px')
                        
             var xAxis = d3.axisTop(xScale)
                            .ticks(24);
                            g2.append("g")
                            .call(xAxis)
                            .attr("transform","translate("+padding.left+","+padding.top+")")
            var yAxis = d3.axisLeft(yScale)
                            .ticks(8)
                            g2.append("g")
                            .call(yAxis)
                            .attr("transform","translate("+padding.left+","+padding.top+")")
                            .attr("display","none")

            var xstep = xScale(2)-xScale(1);
            var ystep = yScale(2)-yScale(1);
                    for(var line=0;line<data.length;line++){
                      
                        var imp = g2.selectAll("g2"+line+"rect")
                                    .data(data[line])
                                    .enter()
                                    .append("rect")
                                    .attr("x",function(d,i){
                                      return  xScale(i);
                                    })
                                    .attr("y",function(){
                                      return yScale(line)
                                    })
                                    .attr("width",function(){
                                      return xstep;
                                    })
                                    .attr("height",function(){
                                      return ystep;
                                    })
                                    .attr("fill",function(d){
                                      
                                      return color(colorlinear(d));
                                    })
                                    .attr("transform","translate("+padding.left+","+0+")")
                                    .attr("fill-opacity",0.9)

                    }











        }

    },

}
</script>



<style >
    .calendar-chart-container{
        position: absolute;
        right: 0%;
        top: calc(1% + 400px);
        
        /* border:1px solid rgba(0, 0, 0, 0.6); */
  /* border-radius: 0.3em;
    box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.3) inset,
  ;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px); */
    }


</style>