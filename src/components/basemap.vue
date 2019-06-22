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
            base_data:{},
			dataset:[]

        }
    },
    mounted:function(){

        d3.select(d3.select('#' + this.id).node().parentNode)
                .style('top', this.top + 'px')
                .style('left', this.left + 'px')


        DataProvider.getpigjiangCsv().then( pigjiangResponse =>{

                DataProvider.getMapJson().then( MapResponse => {

                    let pigjiangdata = dsv.csvParse(pigjiangResponse.data);

                    let mapdata = MapResponse.data;

                    this.base_data = pigjiangdata;

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

                d3.selectAll('.location').attr('r', 4 / d3.event.transform.k)
            		d3.selectAll(".personLine").attr("stroke-width", 3 / d3.event.transform.k)
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
							.scale(12000)
							.translate([this.width / 2-200 , this.height / 2 +120]);

        	//定义路径
        	var path = d3.geoPath()
        		 	.projection(projection);
				
					this.container = map_container.append("g");
					
					this.tooltip = d3.select('#tooltip')
					//let tooltip = document.getElementById('tooltip')
			
					//开始加载地图
					var regionGroups = this.container.append("g")

					regionGroups.selectAll("path")
							.data(this.map_data.features)
							.enter()
							.append("path")
							.attr("class", "province")
							.style("fill", "steelblue")
							.attr("d", path);
                
       
					var circlesGroup = this.container.append("g");
					
					circlesGroup.selectAll(".location")
						 	.data(this.base_data)
				     	    .enter()
				     	    .append("circle")
				     	    .attr("class", "location")
							.attr("transform", function(d) {
								var coor = projection([d.lon, d.lat]);
								return "translate(" + coor[0]+ "," + coor[1] +")";
							})
                            .attr("r", 4)
							.attr("fill", "red")
							
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