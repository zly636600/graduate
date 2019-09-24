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
const $ = require('jquery');

import DataProvider from '../DataProvider';
import * as dsv from 'd3-dsv';
var turf = require('turf');
var geojsonArea = require('geojson-area');

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


        this.$root.$on('selPoly', (selPoly) => {
					//console.log('on')
					this.highLightVoronoi(selPoly)
					
				})

        d3.select(d3.select('#' + this.id).node().parentNode)
                .style('top', this.top + 'px')
                .style('left', this.left + 'px')


        DataProvider.getbaseCsv().then( baseStationResponse =>{

                DataProvider.getMapJson().then( MapResponse => {

                  DataProvider.getMianYangJson().then( MianYangResponse=>{

                    let baseStationdata = dsv.csvParse(baseStationResponse.data);

                    let mapdata = MapResponse.data;

                    let mianyangData = MianYangResponse

                    this.base_data = baseStationdata;

                    this.map_data = mapdata;
                    
                    this.mianyang_data = mianyangData;

                    this.base_data.forEach(d=>{
                      d.key = d.lat + '_'+ d.lon
                      d.key = d.key.replace(".","_")
                      d.key = d.key.replace(".","_")
                      d.key = "A"+d.key
                    })
                    //console.log(this.base_data)
                    this.MapChartInit(this.map_data,this.base_data);


                  })
  
                 })
        })



    },

    watch:{

    },

    methods:{

        MapChartInit(){

            var that = this;
            that.$root.$emit('base_data',this.base_data)
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
              .attr("fill-opacity",0.6)
              .attr("d", path);


            let result = {};
            let finalResult = [];
            let positions = [];
            let dic_base_data = {};
            for(let i = 0;i<this.base_data.length;i++){
              result[this.base_data[i].key] = this.base_data[i];
              let key = this.base_data[i].name;
              if(dic_base_data[key]==undefined){
                dic_base_data[key] = [];
                dic_base_data[key].push({"hour":this.base_data[i].HOUR,"count":this.base_data[i].count})                
              }
              else{
                dic_base_data[key].push({"hour":this.base_data[i].HOUR,"count":this.base_data[i].count})
              }
            }
            for(let key in result){
              finalResult.push(result[key]);//画点时避免重复
            }
            


            //console.log(finalResult)

            finalResult.forEach(function(d,p,q){
              positions.push(projection([d.lon,d.lat])); 
              positions[p].key = d.key;
              positions[p].name = d.name;
              positions[p].lat = d.lat;
              positions[p].lon = d.lon;
            })
            //console.log(positions);

            const _voronoi = d3.voronoi()
              .extent([[-1, -1],[innerWidth+1,innerHeight+1]])
            
            const polygons = _voronoi(positions).polygons();

            //console.log(polygons)
             
            let AreaData = []
            //构造poly1 poly2计算相交的面积
            polygons.forEach(d => {
              let points = [];
              points[0] = [];
              for (var i = 0; i < d.length; i++) {
                 points[0][i] = [];
                 points[0][i]= projection.invert([d[i][0],d[i][1]])
              }
              points[0][d.length] = projection.invert([d[0][0],d[0][1]])//首尾连接
              this.mianyang_data.data.geometry.coordinates[0][this.mianyang_data.data.geometry.coordinates.length]=this.mianyang_data.data.geometry.coordinates[0][0]
              let poly1 = turf.polygon(points)
              let poly2 = turf.polygon(this.mianyang_data.data.geometry.coordinates)
              var intersection = turf.intersect(poly1, poly2);
              if(intersection){

                var area_intersection = turf.area(intersection);
                AreaData.push({"key":d.data.key,"area":area_intersection/1000000,"name":d.data.name,"polyg":d})
              }
            })

            //console.log(AreaData)
            that.$root.$emit('AreaData',AreaData)
            
             var clipPath = this.container
             .append("clipPath")
             .attr("id","myclipPath");

            clipPath.selectAll(".path")
              .data(this.map_data.features)
              .enter()
              .append("path")
              .attr("d",path)
              
              
            //境界表示
            voronoiLayer.selectAll(".cell")
              .data(polygons)
              .enter()
              .append("path")
              .attr("class", "cell")
              .attr("id",function(d){
                return d.data.key
              })
              .attr("fill", "blue")
              .attr("fill-opacity",0)
              .attr("stroke", "white")
              .attr("clip-path","url(#myclipPath)")
              .attr("d",function(d){
                if(d!=undefined){
                  return  "M" + d.join("L")+ "Z";
                }
              } )
              // .on("mouseover",function(){
              //   d3.select(this).attr('fill','red')
              //   .attr("fill-opacity",1)
              // })
              // .on("mouseout",function(){
              //   d3.select(this).transition().attr('fill','blue')
              //   .attr("fill-opacity",0)
              // })
              .on("click",function(d,i){
                
                d3.select("#histogram-chart-container").selectAll("*").remove();
                that.$root.$emit('baseSelected',dic_base_data[d.data.name])
                //console.log(d)
                $.post("http://localhost:3000/re",{'lat':d.data.lat,"lon":d.data.lon},function(data){
                  //console.log(data)
                  that.arr = data;
                  that.$root.$emit('rose_data',that.arr);
                })
                
                
              })	
          
        },
        
        highLightVoronoi(data){
          
            d3.selectAll(".cell")
            .attr("fill","steelblue")
            .attr("fill-opacity",0.6)

            //console.log(d3.select('#' + d))
        

          data.forEach(d=>{
            d3.select('#' + d)
            .attr("fill","#F26101")
            .attr("fill-opacity",1)
            

          })

        }
 

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