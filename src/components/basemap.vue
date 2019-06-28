<template>
  <div class='basemap-chart-container'>
    <!-- <div class='chart-name chart-name-right'>{{name}}</div> -->
		<div id = 'tooltip' style = 'position:absolute'></div>
      <div v-bind:id='id' class='basemap-container'>
   
      </div>
  </div>
</template>

<script>

const d3 = require('d3');
//const voronoi = require('d3-voronoi')

import DataProvider from '../DataProvider';
import * as dsv from 'd3-dsv';


const props = {
  id: {
    type: String,
    default: () => 'basemap-chart-container',
	},
	// name:{
  //   type:String,
  //   default:() => '全国',
  // },
  top:{
    type: Number,
    default: () => 0,
  },
  left:{
    type: Number,
    default: () => 0,
  },
  width:{
    type: Number,
    default: () => parseInt(window.innerWidth),
  },
  height:{
    type:Number,
    default: () => parseInt(window.innerHeight),
  }

};

export default{
    name:'basemap-view',
    props,
    data () {
        return {
            map_data: {},
            base_data:{}

        }
    },
    mounted:function(){

        d3.select(d3.select('#' + this.id).node().parentNode)
                .style('top', this.top + 'px')
                .style('left', this.left + 'px')


        DataProvider.getbaseCsv().then( baseStationResponse =>{

                DataProvider.getMapJson().then( MapResponse => {

                    let baseStationdata = dsv.csvParse(baseStationResponse.data);

                    let mapdata = MapResponse.data;

                    this.base_data = baseStationdata;

                    this.map_data = mapdata;

                    this.MapChartInit(this.map_data,this.base_data);

                 })
        })



    },

    watch:{

    },

    methods:{

        MapChartInit(){

		    var that = this;
            var zoom = d3.zoom()
                .scaleExtent([1, 200])
                .on("zoom", zoomed);

            this.scale = 1
						 
        	function zoomed() {

                that.container.attr("transform", "translate(" + 
								d3.event.transform.x + ","+ 
								d3.event.transform.y +")scale(" + 
								d3.event.transform.k + ")");

                d3.selectAll('.location').attr('r', 2 / d3.event.transform.k)
                d3.selectAll('.cell').attr('stroke-width',1/d3.event.transform.k);
                that.scale = d3.event.transform.k; //调用zoomed函数时scale才会有定义
							
        	}


        	var map_container = d3.select('#' + this.id)
							.append("svg")
							.attr("width", this.width)
							.attr("height", this.height)
							.append("g")
							.call(zoom);

        	//定义地图投影
        	var projection = d3.geoMercator()
							.center([104, 31])
							.scale(15000)
              .translate([this.width / 2-200 , this.height / 2 +250]);

        	//定义路径
        	var path = d3.geoPath()
        		 	.projection(projection);
				
          this.container = map_container.append("g");
          
         
					
					this.tooltip = d3.select('#tooltip')
					//let tooltip = document.getElementById('tooltip')
			
					//开始加载地图
          var regionGroups = this.container.append("g")
          var voronoiLayer = this.container.append("g")

					regionGroups.selectAll("path")
							.data(this.map_data.features)
							.enter()
							.append("path")
							.attr("class", "province")
							.style("fill", "steelblue")
              .attr("d", path);

            let result = {};
            let finalResult = [];
            let positions = [];
            let dic_base_data = {};
            for(let i = 0;i<this.base_data.length;i++){
              result[this.base_data[i].name] = this.base_data[i];
              let key = this.base_data[i].name;
              if(dic_base_data[key]==undefined){
                dic_base_data[key] = [];
                dic_base_data[key].push({"hour":this.base_data[i].HOUR,"count":this.base_data[i].count})                
              }
              else{
                dic_base_data[key].push({"hour":this.base_data[i].HOUR,"count":this.base_data[i].count})
              }
            }

            console.log(this.base_data)
            for(let key in result){
              finalResult.push(result[key]);
            }


            // console.log(finalResult)

            finalResult.forEach(function(d,p,q){
              positions.push(projection([d.lon,d.lat])); 
              positions[p].name = d.name;
            })
            //console.log(positions)
					// var circlesGroup = this.container.append("g");
					
					// circlesGroup.selectAll(".location")
					// 	 	.data(finalResult)
          //     .enter()
          //     .append("circle")
          //     .attr("class", "location")
					// 		.attr("transform", function(d) {
					// 			var coor = projection([d.lon, d.lat]);
					// 			return "translate(" + coor[0]+ "," + coor[1] +")";
					// 		})
          //     .attr("r", 2)
          //     .attr("fill", "red")
              
            const _voronoi = d3.voronoi()
              .extent([[-1, -1],[innerWidth+1, innerHeight+1]]);
            
            const polygons = _voronoi(positions).polygons();
            // console.log(polygons);

            //let that = this;
            
            //境界表示
            voronoiLayer.selectAll(".cell")
              .data(polygons)
              .enter()
              .append("path")
              .attr("class", "cell")
              .attr("fill", "none")
              .attr("stroke", "white")
              .attr("d",function(d){
                //console.log(d)
                if(d!=undefined){
                  return  "M" + d.join("L")+ "Z";
                }
              } )
              .on("mouseover",function(){
                d3.select(this).attr('fill','red')
              })
              .on("mouseout",function(){
                d3.select(this).transition().attr('fill','steelblue')
              })
              .on("click",function(d,i){
                console.log(dic_base_data[d.data.name]);
                that.$root.$emit('baseSelected',dic_base_data[d.data.name])
              })		
              
				},
 

    }
}
</script>
<style lang="css">


.map-chart-container{
  
  position:absolute;
}

.province {
			stroke: black;
			stroke-width: 1px;
}


</style>