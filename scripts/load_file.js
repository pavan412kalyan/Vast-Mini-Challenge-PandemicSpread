var country;
var gender;
var survival;
var vis1_count = 0;

//Visualization 2 global variables start
var all_symptoms = [];
var unique_symptoms = [];
var gap = 480;
var svgVis2;
var width_vis2,height_vis2,margin_vis2,innerHeight_vis2,innerwidth_vis2;
var label_length = 20;
var data;
var count_dead_hosp = [], male_count_dead_hosp = [], female_count_dead_hosp = [];
var data_dead = [], male_data_dead = [], female_data_dead = [];
var data_hosp = [], male_data_hosp = [], female_data_hosp = [];
var xScaleFrom, xScaleTo, yScale, yLabels_symp;
var zLeft, zRight;
var keys_hosp;
var keys_dead;
var divtool;
keys_hosp = ["hosp_R1", "hosp_R2", "hosp_R3"];
keys_dead = ["dead_R1", "dead_R2", "dead_R3"];

//Visualization -2 global variables end

//Vis4 global varibales
var margin_vis4 = {top_vis4: 30, right: 30, bottom: 60, left: 40};
var data_vis3; 
var div_vis4 = d3v6.select("body").append("div")  
    .attr("class", "tooltip2")        
    .style("opacity", 0);

var div1_vis4 = d3v6.select("body").append("div") 
.attr("class", "tooltip3")        
.style("opacity", 0);

var svg_vis3; 
var all_dates = [];
var all_dates_hosp = [];
//vis2 global variables end

document.addEventListener('DOMContentLoaded', function () {
    vis3();
    vis2();

    //Vis 1 data
    mapSvg_vis1 = d3.select('.graph');
    Promise.all([d3.csv('data/thailand_graph1.csv'),
    d3.csv('data/aleppo_graph1.csv'),
    d3.csv('data/colombia_graph1.csv'),
    d3.csv('data/iran_graph1.csv'),
    d3.csv('data/karachi_graph1.csv'),
    d3.csv('data/lebanon_graph1.csv'),
    d3.csv('data/nairobi_graph1.csv'),
    d3.csv('data/saudiarabia_graph1.csv'),
    d3.csv('data/turkey_graph1.csv'),
    d3.csv('data/venezuela_graph1.csv'),
    d3.csv('data/yemen_graph1.csv'),
    d3.csv('data/total_hospitalized_graph1.csv')])
          .then(function(values){
            thailand = values[0]
            aleppoData = values[1]
            colombiaData = values[2]
            iranData = values[3]
            karachiData = values[4]
            lebanonData = values[5]
            nairobiData = values[6]
            saudiarabiaData = values[7]
            turkeyData = values[8]
            venezuelaData = values[9]
            yemenData = values[10]
            allData = values[11]
    // console.log(allData)
    drawGraph_vis1();
  })

  //HeatMap event data
  mapSvg = d3v6.select('#my_dataviz')
    Promise.all([d3v6.csv('data/Heatmap_latest.csv'),
                d3v6.csv('data/Heatmap_Data.csv'),
              d3v6.csv('data/Heatmap_hosp.csv')]).then(function(values){
                data_vis3 = values[0]
                data_vis3.forEach(d => {
            all_dates.push(d['DATE']);
            d['DATE'] = d3v6.timeParse("%m-%d-%Y")(d['DATE']);
            d["Country_name"] = country_name(d.Symptoms);
            d['Symtom_name'] = symptoms_name(d.Symptoms);
        })
        // console.log(data);
        old = values[1];
        hosp = values[2];
        hosp.forEach(d => {
          all_dates_hosp.push(d['DATE']);
          d['DATE'] = d3v6.timeParse("%m-%d-%Y")(d['DATE']);
          d["Country_name"] = country_name(d.Symptoms);
          d['Symtom_name'] = symptoms_name(d.Symptoms);
      });
      // console.log("Printing Hosp data", hosp);
    drawgraphcheck();

    })

    //apriori
    Promise.all([d3.csv('data/combinedApriori.csv'),d3.csv('data/counter.csv')])
      .then(function (values) {
        
        apriori = values[0];
        apriori_death=values[1];

        drawMapApriori();

        
      })
  
  });

function countryChange(country){
  vis3();
  drawGraph_vis1();
  drawMapApriori();
}

function drawgraphcheck(){
 var status_heatmap = parseInt(d3.select("#survival").node().value);
 if(status_heatmap == 1){
   drawgraph();
 }else{
   drawgraph_hosp();
 }
}

function genderChange(country){
  vis3();
  if(d3.select('input[name="gender"]:checked').node().value == "male"){
    drawMap_male();
  }
  else if(d3.select('input[name="gender"]:checked').node().value == "female"){
    drawMap_female();
  }
  else{
    drawMap();
  }
}

function survivalChange(survival){
  // console.log(d3.select("#survival").node().value);
  if(d3.select("#survival").node().value == "0"){
    drawgraph_hosp();
  }
  else{
    drawgraph();
  }

  drawMapApriori();
}

//apriori starts here

function drawMapApriori()
{

    d3.select("#svg_apriori_chart")
    .selectAll("g")
    .remove();
//apriori
    let textSvg = d3.select('#svg_apriori_chart');
    textSvg.append("text")
            .attr("transform", "translate(" + 290 + ", " + 200 + ")")
            .style("text-anchor","middle")
            .style("font-size","20px")
            .style("opacity","0.8")
            .style("fill","#800000")
            .style("font-family","Sans-serif")
            .style("font-weight","bold")
            .text("First frequent symptom sets");

    textSvg.append("text")
            .attr("transform", "translate(" + 280 + ", " + 450 + ")")
            .style("text-anchor","middle")
            .style("font-size","20px")
            .style("opacity","0.8")
            .style("fill","#800000")
            .style("font-family","Sans-serif")
            .style("font-weight","bold")
            .text("Second frequent symptom sets");

    textSvg.append("text")
            .attr("transform", "translate(" + 290 + ", " + 650 + ")")
            .style("text-anchor","middle")
            .style("font-size","20px")
            .style("opacity","0.8")
            .style("fill","#800000")
            .style("font-family","Sans-serif")
            .style("font-weight","bold")
            .text("Third frequent symptom sets");

    textSvg.append("text")
            .attr("transform", "translate(" + 560 + ", " + 70 + ")")
            .style("text-anchor","middle")
            .style("font-size","20px")
            .style("opacity","0.8")
            .style("font-family","Sans-serif")
            .style("fill","#800000")
            .style("font-weight","bold")
            .text("Male");

    textSvg.append("text")
            .attr("transform", "translate(" + 860 + ", " + 70 + ")")
            .style("text-anchor","middle")
            .style("font-size","20px")
            .style("opacity","0.8")
            .style("fill","#800000")
            .style("font-family","Sans-serif")
            .style("font-weight","bold")
            .text("Female");

    textSvg.append("text")
            .attr("transform", "translate(" + 1150 + ", " + 70 + ")")
            .style("text-anchor","middle")
            .style("font-size","20px")
            .style("opacity","0.8")
            .style("fill","#800000")
            .style("font-family","Sans-serif")
            .style("font-weight","bold")
            .text("All");

    textSvg.append("line")
            .style("fill", "#800000")
            .style("stroke","#800000")
            .style("stroke-width","0.4px")
            .attr("x1",150 )
            .attr("x2",1300)
            .attr("y1",85)
            .attr("y2",85);

    textSvg.append("line")
            .style("fill", "#800000")
            .style("stroke","#800000")
            .style("stroke-width","0.4px")
            .attr("x1",150 )
            .attr("x2",1300)
            .attr("y1",350)
            .attr("y2",350);

    textSvg.append("line")
            .style("fill", "#800000")
            .style("stroke","#800000")
            .style("stroke-width","0.4px")
            .attr("x1",150 )
            .attr("x2",1300)
            .attr("y1",550)
            .attr("y2",550);

    textSvg.append("line")
            .style("fill", "#800000")
            .style("stroke","#800000")
            .style("stroke-width","0.4px")
            .attr("x1",450 )
            .attr("x2",450)
            .attr("y1",50)
            .attr("y2",700);

    textSvg.append("line")
            .style("fill", "#800000")
            .style("stroke","#800000")
            .style("stroke-width","0.4px")
            .attr("x1",700 )
            .attr("x2",700)
            .attr("y1",50)
            .attr("y2",700);

    textSvg.append("line")
            .style("fill", "#800000")
            .style("stroke","#800000")
            .style("stroke-width","0.4px")
            .attr("x1",1000 )
            .attr("x2",1000)
            .attr("y1",50)
            .attr("y2",700);
    // console.log(apriori_death)

    apriori.forEach(function(d) {
                    
        for(var col in d){
            if(col == "country" || col == "GENDER")
                continue;
            d[col] = +d[col];
        }
    });

            //GENDER,DEATH,country
            selected_death_apriori = parseInt(d3.select("#survival").node().value);
            selected_country_apriori = d3.select("#countries").node().value;
            if(selected_country_apriori=='all') selected_country_apriori='yemen';
            console.log("selected death",selected_death_apriori);
            console.log("selected_country_apriori",selected_country_apriori);
            apriori_filtered_M = apriori.filter( function( d ) {    
                // console.log("---"+d)
                if( d.GENDER=="M" && d.country==selected_country_apriori && d.DEATH==selected_death_apriori ) 
                                                    return d ; });
            apriori_filtered_F = apriori.filter( function( d ) {
                // console.log("---"+d)
                if( d.GENDER=="F" && d.country==selected_country_apriori && d.DEATH==selected_death_apriori ) 
                                                    return d ;
            });
            // console.log(apriori_filtered_M)
            apriori_filtered_A = apriori.filter( function( d ) {   
                //  console.log("printing-"+d)
                if( d.GENDER=="A" && d.country==selected_country_apriori && d.DEATH==selected_death_apriori ) 
                                                    return d ;
            });
            // alert(apriori_filtered_A.length)
            flltered_helper(apriori_filtered_M,-300,'M',selected_death_apriori,selected_country_apriori)
            flltered_helper(apriori_filtered_F,300,'F',selected_death_apriori,selected_country_apriori)
            flltered_helper(apriori_filtered_A,900,'A',selected_death_apriori,selected_country_apriori)
}

function flltered_helper(apriori_filtered,X,gender,status,country_selected)
{
    // color_map =["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]
    color_map = {
        'Heart Problems': '#ff5959', 
        'Vocal Problems': '#facf5a', 
        'abdominal pain': '#ffd717', 
        'abscess': '#085f63', 
        'bleeding': '#74f9ff', 
        'body pain': '#ff008e', 
        'breathing': '#caa5f1', 
        'chest': '#f0f696', 
        'cough': '#fcb1b1', 
        'cramp': 'palegreen', 
        'deficit': '#78fee0', 
        'diabetic': '#f07b3f', 
        'diarrhea': '#ffd460', 
        'dizziness': '#ea5455', 
        'fatigue': '#b24968', 
        'fever': '#587850', 
        'headache': 'skyblue', 
        'infections': '#78b0a0', 
        'injury': '#f8d0b0', 
        'laceration': '#1a936f', 
        'migraine': '#fd0054', 
        'others': '#bf5caa', 
        'pregnant': '#7a57d1', 
        'rash': '#22b2da', 
        'urinate': '#b2d430', 
        'vaginal': '#ffeecf', 
        'vision': 'orange', 
        'vomiting': 'red'
    }
    sym_map = {
    'Heart Problems': 'HP', 
    'Vocal Problems': 'VP', 
    'abdominal pain': 'AP', 
    'abscess': 'AB', 
    'bleeding': 'BLD', 
    'body pain': 'BP', 
    'breathing': 'BR', 
    'chest': 'CP', 
    'cough': 'CG', 
    'cramp': 'CR', 
    'deficit': 'DF', 
    'diabetic': 'DB', 
    'diarrhea': 'DR', 
    'dizziness': 'DZ', 
    'fatigue': 'FTG', 
    'fever': 'FVR', 
    'headache': 'HA', 
    'infections': 'IFT', 
    'injury': 'IJR', 
    'laceration': 'LCR', 
    'migraine': 'MGR', 
    'others': 'OTH', 
    'pregnant': 'PGT', 
    'rash': 'RASH', 
    'urinate': 'URT', 
    'vaginal': 'VG', 
    'vision': 'VS', 
    'vomiting': 'VMT'
   }
   radiusfactor=1200
    // X=-700
    col_apr = Object.keys(apriori_filtered[0])
    // console.log(col_apr)
    symptoms_apriori = []
    for(var i=0;i<=27;i++) {
        symptoms_apriori.push(col_apr[i]);
    }
    // console.log("++++++ +        " +symptoms_apriori)
    let nodes_1 = []  
    first_data = apriori_filtered[0] 
    symptoms_apriori.forEach(element => {   res = [];
                for (let row of apriori_death) {
                    // console.log("Printing row: ",row);
                    if (row.gender == gender && row.country==country_selected && row.status ==status && row.symptom == element) {
                        res.push(row);
                        break;
                    }  
                }
            // console.log("rrrrrrrrrrrrr " + res[0]['count'])           
            count_number = +res[0]['count'];
            // console.log("rrrrrrrrrrrrr " + count_number)
            if(first_data[element]== 1  )
            nodes_1.push({ symptom : element , type : 1,'gender' : gender,'country':country_selected,'status':status,count : count_number})
            else if(first_data[element]== -1) {
                nodes_1.push({ symptom : element , type : -1 ,'gender' : gender ,'country':country_selected ,'status':status,count : count_number})
            }
        }  
    );
    draw2(nodes_1,X,-400,radiusfactor,1)
    let nodes_2 = []
    first_data = apriori_filtered[1]
    symptoms_apriori.forEach(element => { res = [];
            for (let row of apriori_death) {
            if (row.gender == gender && row.country==country_selected && row.status ==status && row.symptom == element) {
                res.push(row);
                break;
                }
            }
        // console.log("rrrrrrrrrrrrr " + res[0]['count'])           
        count_number = +res[0]['count'];
        // console.log("rrrrrrrrrrrrr " + count_number)
        if(first_data[element]== 1  )
        nodes_2.push({ symptom : element , type : 1,'gender' : gender,'country':country_selected,'status':status,count : count_number})
        // else if(first_data[element]== -1)
        // {
        //     nodes_2.push({ symptom : element , type : -1 ,'gender' : gender ,'country':country_selected ,'status':status,count : count_number})
        // }  
        }
    );
    draw2(nodes_2,X,100,radiusfactor,2)  
    let nodes_3 = []
    first_data = apriori_filtered[2]
    symptoms_apriori.forEach(element =>{ res = [];
            for (let row of apriori_death) {
            if (row.gender == gender && row.country==country_selected && row.status ==status && row.symptom == element) {
                res.push(row);
                break;
                }
        }
        //console.log("rrrrrrrrrrrrr " + res[0]['count'])           
        count_number = +res[0]['count'];
        //console.log("rrrrrrrrrrrrr " + count_number)
        // if(first_data[element]== 1  )
        // nodes_3.push({ symptom : element , type : 1,'gender' : gender,'country':country_selected,'status':status,count : count_number})
       // else
        if(first_data[element]== -1) {
            nodes_3.push({ symptom : element , type : -1 ,'gender' : gender ,'country':country_selected ,'status':status,count : count_number})
            }
        }
    );
    draw2(nodes_3,X,500,radiusfactor,3)
}

function draw2(nodes,x,y,radiusfactor,level) {
//    radiusfactor=900
    var div_tool_apriori = d3.select("#tooltip_apriori")
                            .attr("position","absolute")
                            .attr("class", "tooltip_apriori")
                            .style("opacity", 0);
    let svgSimple = d3.select('#svg_apriori_chart');
    let svgWidth = svgSimple.node().clientWidth + x;
    let svgHeight = svgSimple.node().clientHeight + y;
    let svgCircular = d3.select('#svg_apriori_chart');
    let circularG = svgCircular.append('g')
                            .attr('transform', `translate(${svgWidth/2},${svgHeight/2})`)
          //  let radius = (svgHeight-60) /25;
    let radius = (radiusfactor-60) /25;
            // Calculate the positions of each node
    let polarScale = d3.scaleLinear()
                        .domain([0, nodes.length])
                        .range([0, 2 * Math.PI]);
        // Convert from polar to cartesian coordinates
                // x = r cos Θ
                //  y = r sin Θ
    nodes.forEach((d,i) => {
        let theta = polarScale(i);
        d.theta = theta;
        d.polarX = radius * Math.cos(theta);
        d.polarY = radius * Math.sin(theta)
    });
            // Draw the nodes and links
    circularG.selectAll('.node')
                .data(nodes)
                .join('circle')
                .classed('node', true)
                .style('fill', function (d, i) {    
                        // console.log("printing d: ",d.symptom
                          return color_map[d.symptom]
                       })
                .style('opacity',function (d, i) {    
                             if(level==1) return 0.7
                             if(level==2) return 0.5
                             if(level==3) return 0.3
                        })
                .attr('cx', d => d.polarX)
                .attr('cy', d => d.polarY)
                .attr('r', function (d, i) {
                            r=d.count
                            if(r>200000)    r=200000
                            return 20 + (r)/5500;
                        })
                .style('stroke','800000')/*function(d){
                    if(d.level==0) return 'yellow';
                    else if(d.level==1) return 'y';
                    else return 'yellow';
                })*/
                .style('stroke-width',1.5)/*function(d){
                    if(d.level==0) return 5;
                    else if(d.level==1) return 3;
                    else return 2;
                })*/
                .on('mouseover', function (d, i) {
                //  alert(d3.event.pageX +"="+ d['count'])
                div_tool_apriori.html("Number of patients: "+d['count'] + " <br>  Symptom: "+ d.symptom  )
                                .style("left", (d3.event.pageX + 15) + "px")
                                .style("top", (d3.event.pageY - 50) + "px")
                                // .style("left",  15 + "px")
                                // .style("top", 25+ "px")
                                .style("background","white")
                                .style("display","inline")
                                .style("opacity",1);   
                })   
                .on('mousemove', function (d, i) {                
                })
                .on('mouseout', function (d, i) {
                    div_tool_apriori.html("Country:"+d['count'] )
                    .style("display","none")
                });
                circularG.selectAll('.node-label')
                            .data(nodes)
                            .join('text')
                            .classed('node-label', true)
                            .attr('x', d => d.polarX)
                            .attr('y', d => d.polarY)
                            .text(d =>   sym_map[d.symptom]);        
                circularG.selectAll('.link').lower();
}


//apriori ends here

//heatmap functions start
function onlyUnique_vis4(value, index, self) {
  return self.indexOf(value) === index;
}
function country_name(value){
  var temp_value = Math.ceil(value/10);
  if(temp_value == 1){
    return "Aleppo";
  }
  if(temp_value == 2){
    return "Colombia";
  }
  if(temp_value == 3){
    return "Iran";
  }
  if(temp_value == 4){
    return "Karachi";
  }
  if(temp_value == 5){
    return "Lebanon";
  }
  if(temp_value == 6){
    return "Nairobi";
  }
  if(temp_value == 7){
    return "Saudi Arabia";
  }
  if(temp_value == 8){
    return "Thailand";
  }
  if(temp_value == 9){
    return "Turkey";
  }
  if(temp_value == 10){
    return "Venezuela";
  }
  if(temp_value == 11){
    return "Yemen";
  }
}
function symptoms_name(value1){
  var temp_value1 = value1%10;
  if(temp_value1 == 1){
    return "Body Pain";
  }
  if(temp_value1 == 2){
    return "Others";
  }
  if(temp_value1 == 3){
    return "Vomiting";
  }
  if(temp_value1 == 4){
    return "Abdominal Pain";
  }
  if(temp_value1 == 5){
    return "Fever";
  }
  if(temp_value1 == 6){
    return "Injury";
  }
  if(temp_value1 == 7){
    return "Diarrhea";
  }
  if(temp_value1 == 8){
    return "Cough";
  }
  if(temp_value1 == 9){
    return "Bleeding";
  }
  if(temp_value1 == 0){
    return "Vision";
  }
}
  
const N = 110;
const arr_x = Array.from({length: N}, (_, index) => index + 1);

function drawgraph(){
var width = 1200 - margin_vis4.left - margin_vis4.right;
  var height = 700 - margin_vis4.top_vis4 - margin_vis4.bottom;
  mapSvg.selectAll('*').remove();
  svg_vis3 = d3v6.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin_vis4.left + margin_vis4.right)
      .attr("height", height + margin_vis4.top_vis4 + margin_vis4.bottom)
      .append("g")
      .attr("transform",
            "translate(" + margin_vis4.left + "," + margin_vis4.top_vis4 + ")")
      .attr('display','auto')
      .attr('margin','auto');
    
    // Labels of row and columns
    var myGroups = arr_x
    // var myVars = d3v6.map(old,function(d){
    //     return d3v6.timeParse("%m-%d-%Y")(d['Date'])
    // })
    // console.log("All Dates", all_dates);
    var unique_dates = all_dates.filter(onlyUnique_vis4);
    var myVars = [];
    for(var i=0;i<unique_dates.length;i++){
      myVars.push(d3v6.timeParse("%m-%d-%Y")(unique_dates[i]));
    }

    // Build X scales and axis:
    var x = d3v6.scaleBand()
      .range([ 0, width ])
      .domain(myGroups)
      .padding(0.01);
      svg_vis3.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3v6.axisBottom(x))
      .selectAll('.tick','.tick line').remove()
      .selectAll('.domain').remove();
      
    
    // Build X scales and axis:
    var y = d3v6.scaleBand()
      .range([ height, 0 ])
      .domain(myVars)
      .padding(0.05);
      svg_vis3.append("g")
      .call(d3v6.axisLeft(y).tickFormat(d3v6.timeFormat("%b-%d")).tickSize(0.1))
      .attr("dx", "0.3em")
      .selectAll('.tick line').remove()
      .selectAll('.domain').remove();
      svg_vis3.selectAll(".tick text")
     .attr("font-size","0.9em");

      var mouseover = function(d) {
        div_vis4.style("opacity", 1)
      }
      var mousemove = function(event,d) {
        div_vis4.html("Deaths: "+(+d.Deaths)+ "<br/>" + " Country: " +d.Country_name + "<br/>" + "Symptom: "+d.Symtom_name + "<br/>" + "Date: " + d3v6.timeFormat("%b-%d")(d.DATE)) 
          .style("left", (event.pageX) + "px")    
          .style("top", (event.pageY - 28) + "px");
      }
      var mouseleave = function(d) {
        div_vis4.style("opacity", 0)
      }
    
    // Build color scale
    var myColor = d3v6.scaleLinear()
      .range(["#fff5f0","#fdd3c1","#fdd2c0","#fdd1bf","#fdd0bd","#fdcfbc","#fdceba","#fdcdb9","#fdccb7","#fdcbb6","#fdc9b4","#fdc8b3","#fdc7b2","#fdc6b0","#fdc5af","#fdc4ad","#fdc2ac","#fdc1aa","#fdc0a8","#fcbfa7","#fcbea5","#fcbca4","#fcbba2","#fcbaa1","#fcb99f","#fcb89e","#fcb69c","#fcb59b","#fcb499","#fcb398","#fcb196","#fcb095","#fcaf94","#fcae92","#fcac91","#fcab8f","#fcaa8e","#fca98c","#fca78b","#fca689","#fca588","#fca486","#fca285","#fca183","#fca082","#fc9e81","#fc9d7f","#fc9c7e","#fc9b7c","#fc997b","#fc987a","#fc9778","#fc9677","#fc9475","#fc9374","#fc9273","#fc9071","#fc8f70","#fc8e6f","#fc8d6d","#fc8b6c","#fc8a6b","#fc8969","#fc8868","#fc8667","#fc8565","#fc8464","#fb8263","#fb8162","#fb8060","#fb7f5f","#fb7d5e","#fb7c5d","#fb7b5b","#fb795a","#fb7859","#fb7758","#fb7657","#fb7455","#fa7354","#fa7253","#fa7052","#fa6f51","#fa6e50","#fa6c4e","#f96b4d","#f96a4c","#f9684b","#f9674a","#f96549","#f86448","#f86347","#f86146","#f86045","#f75e44","#f75d43","#f75c42","#f65a41","#f65940","#f6573f","#f5563e","#f5553d","#f4533c","#f4523b","#f4503a","#f34f39","#f34e38","#f24c37","#f24b37","#f14936","#f14835","#f04734","#ef4533","#ef4433","#ee4332","#ed4131","#ed4030","#ec3f2f","#eb3d2f","#eb3c2e","#ea3b2d","#e93a2d","#e8382c","#e7372b","#e6362b","#e6352a","#e5342a","#e43229","#e33128","#e23028","#e12f27","#e02e27","#df2d26","#de2c26","#dd2b25","#dc2a25","#db2924","#da2824","#d92723","#d72623","#d62522","#d52422","#d42321","#d32221","#d22121","#d12020","#d01f20","#ce1f1f","#cd1e1f","#cc1d1f","#cb1d1e","#ca1c1e","#c91b1e","#c71b1d","#c61a1d","#c5191d","#c4191c","#c3181c","#c2181c","#c0171b","#bf171b","#be161b","#bd161a","#bb151a","#ba151a","#b91419","#b81419","#b61419","#b51319", "#FF0000"]) //"#F9EDED", "#FF0000" //YlOrRd
      .domain([1,3])
      svg_vis3.selectAll()
    .data(data_vis3, function(d) {return d.Symptoms+':'+d.DATE;})
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(d.Symptoms) })
    .attr("y", function(d) { return y(d.DATE) })
    .attr("width", x.bandwidth() )
    .attr("height", y.bandwidth() )
    .style("fill", function(d) { return myColor(d.Deaths)} )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

    var median = svg_vis3.append("line")
                     .attr("x1", x(11))
                     .attr("y1", 0)
                     .attr("x2", x(11))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");
                     svg_vis3.append("line")
                     .attr("x1", x(21))
                     .attr("y1", 0)
                     .attr("x2", x(21))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");
                     svg_vis3.append("line")
                     .attr("x1", x(31))
                     .attr("y1", 0)
                     .attr("x2", x(31))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");
                     svg_vis3.append("line")
                     .attr("x1", x(41))
                     .attr("y1", 0)
                     .attr("x2", x(41))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");
                     svg_vis3.append("line")
                     .attr("x1", x(51))
                     .attr("y1", 0)
                     .attr("x2", x(51))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");
                     svg_vis3.append("line")
                     .attr("x1", x(61))
                     .attr("y1", 0)
                     .attr("x2", x(61))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");
                     svg_vis3.append("line")
                     .attr("x1", x(71))
                     .attr("y1", 0)
                     .attr("x2", x(71))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");
                     svg_vis3.append("line")
                     .attr("x1", x(81))
                     .attr("y1", 0)
                     .attr("x2", x(81))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");
                     svg_vis3.append("line")
                     .attr("x1", x(91))
                     .attr("y1", 0)
                     .attr("x2", x(91))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");
                     svg_vis3.append("line")
                     .attr("x1", x(101))
                     .attr("y1", 0)
                     .attr("x2", x(101))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");
                     svg_vis3.append("line")
                     .attr("x1", x(111))
                     .attr("y1", 0)
                     .attr("x2", x(111))
                     .attr("y2", height)
                     .attr("stroke-width", 2.5)
                     .attr("stroke", "black");

                     svg_vis3.append("text")
                     .attr("id", "axisLabel")
                     .attr("transform",
                         "translate(" + (width / 15+2) + " ," +
                         (height-5) + ")")
                     .style("text-anchor", "middle")
                     .style("font-size","12px")
                     .style("opacity","0.5")
                     .style("fill","black")
                     .style("font-weight","bold")
                     .text("Aleppo");
                     svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                         "translate(" + (width / 15+98) + " ," +
                         (height-5) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","12px")
                    .style("opacity","0.5")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Columbia");
                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                         "translate(" + (width / 13+206) + " ," +
                         (height-5) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","12px")
                    .style("opacity","0.5")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Iran");
                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                         "translate(" + (width / 13+299) + " ," +
                         (height-5) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","12px")
                    .style("opacity","0.5")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Karachi");
                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                         "translate(" + (width / 13+399) + " ," +
                         (height-5) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","12px")
                    .style("opacity","0.5")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Lebanon");
                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                         "translate(" + (width / 13+503) + " ," +
                         (height-5) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","12px")
                    .style("opacity","0.5")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Nairobi");
                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                         "translate(" + (width / 13+591) + " ," +
                         (height-5) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","12px")
                    .style("opacity","0.5")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Saudi Arabia");
                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                         "translate(" + (width / 13+705) + " ," +
                         (height-5) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","12px")
                    .style("opacity","0.5")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Thailand");
                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                         "translate(" + (width / 13+814) + " ," +
                         (height-5) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","12px")
                    .style("opacity","0.5")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Turkey");
                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                         "translate(" + (width / 13+908) + " ," +
                         (height-5) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","12px")
                    .style("opacity","0.5")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Venezuela");
                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                         "translate(" + (width / 13+1020) + " ," +
                         (height-5) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","12px")
                    .style("opacity","0.5")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Yemen");

                    svg_vis3.append('image')
                    .attr('xlink:href', function(){ return '/images/reds.PNG'})
                    .attr("width", "600")
                    .attr("transform",
                          "translate(" + (width / 13-107) + " ," +
                          (height+25) + ")")

                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                          "translate(" + (width / 13+690) + " ," +
                          (height+41) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","17px")
                    .style("opacity","0.9")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Intensity of Red is proportional to no. of Deaths");

}

function drawgraph_hosp(){
  var   width = 1200 - margin_vis4.left - margin_vis4.right;
  var height = 700 - margin_vis4.top_vis4 - margin_vis4.bottom;
  mapSvg.selectAll('*').remove()
    mapSvg.selectAll('*').remove();
    svg_vis3 = d3v6.select("#my_dataviz")
      .append("svg")
        .attr("width", width + margin_vis4.left + margin_vis4.right)
        .attr("height", height + margin_vis4.top_vis4 + margin_vis4.bottom)
        .append("g")
        .attr("transform",
              "translate(" + margin_vis4.left + "," + margin_vis4.top_vis4 + ")")
        .attr('display','auto')
        .attr('margin','auto');
      
      // Labels of row and columns
      var myGroups = arr_x
      // var myVars = d3v6.map(old,function(d){
      //     return d3v6.timeParse("%m-%d-%Y")(d['Date'])
      // })
      // console.log("All Dates", all_dates);
      var unique_dates = all_dates_hosp.filter(onlyUnique_vis4);
      var myVars = [];
      for(var i=0;i<unique_dates.length;i++){
        myVars.push(d3v6.timeParse("%m-%d-%Y")(unique_dates[i]));
      }
  
      // Build X scales and axis:
      var x = d3v6.scaleBand()
        .range([ 0, width ])
        .domain(myGroups)
        .padding(0.01);
        svg_vis3.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3v6.axisBottom(x))
        .selectAll('.tick','.tick line').remove()
        .selectAll('.domain').remove();
        
      
      // Build X scales and axis:
      var y = d3v6.scaleBand()
        .range([ height, 0 ])
        .domain(myVars)
        .padding(0.05);
        svg_vis3.append("g")
        .call(d3v6.axisLeft(y).ticks(30).tickFormat(d3v6.timeFormat("%b-%d")).tickSize(0.1))
        .attr("dx", "0.3em")
        .selectAll('.tick line').remove()
        .selectAll('.domain').remove();
        svg_vis3.selectAll(".tick text")
     .attr("font-size","0.9em");
  
        var mouseover = function(d) {
          div1_vis4.style("opacity", 1)
        }
        var mousemove = function(event,d) {
          div1_vis4.html("Hospitalized: "+(+d.Deaths)+ "<br/>" + " Country: " +d.Country_name + "<br/>" + "Symptom: "+d.Symtom_name + "<br/>" + "Date: " + d3v6.timeFormat("%b-%d")(d.DATE))  
            .style("left", (event.pageX) + "px")    
            .style("top", (event.pageY - 28) + "px");
        }
        var mouseleave = function(d) {
          div1_vis4.style("opacity", 0)
        }
      
      // Build color scale
      var myColor = d3v6.scaleLinear()
        .range(['#d3d9d1','#c6bfa7']) //"#F9EDED", "#FF0000" //YlOrRd
        .domain([1,700]);
        svg_vis3.selectAll()
      .data(hosp, function(d) {return d.Symptoms+':'+d.DATE;})
      .enter()
      .append("rect")
      .attr("x", function(d) { return x(d.Symptoms) })
      .attr("y", function(d) { return y(d.DATE) })
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.Deaths)} )
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  
      var median = svg_vis3.append("line")
                       .attr("x1", x(11))
                       .attr("y1", 0)
                       .attr("x2", x(11))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
                       svg_vis3.append("line")
                       .attr("x1", x(21))
                       .attr("y1", 0)
                       .attr("x2", x(21))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
                       svg_vis3.append("line")
                       .attr("x1", x(31))
                       .attr("y1", 0)
                       .attr("x2", x(31))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
                       svg_vis3.append("line")
                       .attr("x1", x(41))
                       .attr("y1", 0)
                       .attr("x2", x(41))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
                       svg_vis3.append("line")
                       .attr("x1", x(51))
                       .attr("y1", 0)
                       .attr("x2", x(51))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
                       svg_vis3.append("line")
                       .attr("x1", x(61))
                       .attr("y1", 0)
                       .attr("x2", x(61))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
                       svg_vis3.append("line")
                       .attr("x1", x(71))
                       .attr("y1", 0)
                       .attr("x2", x(71))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
                       svg_vis3.append("line")
                       .attr("x1", x(81))
                       .attr("y1", 0)
                       .attr("x2", x(81))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
                       svg_vis3.append("line")
                       .attr("x1", x(91))
                       .attr("y1", 0)
                       .attr("x2", x(91))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
                       svg_vis3.append("line")
                       .attr("x1", x(101))
                       .attr("y1", 0)
                       .attr("x2", x(101))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
                       svg_vis3.append("line")
                       .attr("x1", x(111))
                       .attr("y1", 0)
                       .attr("x2", x(111))
                       .attr("y2", height)
                       .attr("stroke-width", 2.5)
                       .attr("stroke", "black");
  
                       svg_vis3.append("text")
                       .attr("id", "axisLabel")
                       .attr("transform",
                           "translate(" + (width / 15+2) + " ," +
                           (height-5) + ")")
                       .style("text-anchor", "middle")
                       .style("font-size","12px")
                       .style("opacity","1")
                       .style("fill","white")
                       .style("font-weight","bold")
                       .text("Aleppo");
                       svg_vis3.append("text")
                      .attr("id", "axisLabel")
                      .attr("transform",
                           "translate(" + (width / 15+98) + " ," +
                           (height-5) + ")")
                      .style("text-anchor", "middle")
                      .style("font-size","12px")
                      .style("opacity","1")
                      .style("fill","white")
                      .style("font-weight","bold")
                      .text("Columbia");
                      svg_vis3.append("text")
                      .attr("id", "axisLabel")
                      .attr("transform",
                           "translate(" + (width / 13+206) + " ," +
                           (height-5) + ")")
                      .style("text-anchor", "middle")
                      .style("font-size","12px")
                      .style("opacity","1")
                      .style("fill","white")
                      .style("font-weight","bold")
                      .text("Iran");
                      svg_vis3.append("text")
                      .attr("id", "axisLabel")
                      .attr("transform",
                           "translate(" + (width / 13+299) + " ," +
                           (height-5) + ")")
                      .style("text-anchor", "middle")
                      .style("font-size","12px")
                      .style("opacity","1")
                      .style("fill","white")
                      .style("font-weight","bold")
                      .text("Karachi");
                      svg_vis3.append("text")
                      .attr("id", "axisLabel")
                      .attr("transform",
                           "translate(" + (width / 13+399) + " ," +
                           (height-5) + ")")
                      .style("text-anchor", "middle")
                      .style("font-size","12px")
                      .style("opacity","1")
                      .style("fill","white")
                      .style("font-weight","bold")
                      .text("Lebanon");
                      svg_vis3.append("text")
                      .attr("id", "axisLabel")
                      .attr("transform",
                           "translate(" + (width / 13+503) + " ," +
                           (height-5) + ")")
                      .style("text-anchor", "middle")
                      .style("font-size","12px")
                      .style("opacity","1")
                      .style("fill","white")
                      .style("font-weight","bold")
                      .text("Nairobi");
                      svg_vis3.append("text")
                      .attr("id", "axisLabel")
                      .attr("transform",
                           "translate(" + (width / 13+591) + " ," +
                           (height-5) + ")")
                      .style("text-anchor", "middle")
                      .style("font-size","12px")
                      .style("opacity","1")
                      .style("fill","white")
                      .style("font-weight","bold")
                      .text("Saudi Arabia");
                      svg_vis3.append("text")
                      .attr("id", "axisLabel")
                      .attr("transform",
                           "translate(" + (width / 13+705) + " ," +
                           (height-5) + ")")
                      .style("text-anchor", "middle")
                      .style("font-size","12px")
                      .style("opacity","1")
                      .style("fill","white")
                      .style("font-weight","bold")
                      .text("Thailand");
                      svg_vis3.append("text")
                      .attr("id", "axisLabel")
                      .attr("transform",
                           "translate(" + (width / 13+814) + " ," +
                           (height-5) + ")")
                      .style("text-anchor", "middle")
                      .style("font-size","12px")
                      .style("opacity","1")
                      .style("fill","white")
                      .style("font-weight","bold")
                      .text("Turkey");
                      svg_vis3.append("text")
                      .attr("id", "axisLabel")
                      .attr("transform",
                           "translate(" + (width / 13+908) + " ," +
                           (height-5) + ")")
                      .style("text-anchor", "middle")
                      .style("font-size","12px")
                      .style("opacity","1")
                      .style("fill","white")
                      .style("font-weight","bold")
                      .text("Venezuela");
                      svg_vis3.append("text")
                      .attr("id", "axisLabel")
                      .attr("transform",
                           "translate(" + (width / 13+1020) + " ," +
                           (height-5) + ")")
                      .style("text-anchor", "middle")
                      .style("font-size","12px")
                      .style("opacity","1")
                      .style("fill","white")
                      .style("font-weight","bold")
                      .text("Yemen");
  

                    svg_vis3.append('image')
                    .attr('xlink:href', function(){ return '/images/blue_hue.PNG'})
                    .attr("width", "600")
                    .attr("transform",
                          "translate(" + (width / 13-107) + " ," +
                          (height+25) + ")")

                    svg_vis3.append("text")
                    .attr("id", "axisLabel")
                    .attr("transform",
                          "translate(" + (width / 13+707) + " ," +
                          (height+38) + ")")
                    .style("text-anchor", "middle")
                    .style("font-size","17px")
                    .style("opacity","0.9")
                    .style("fill","black")
                    .style("font-weight","bold")
                    .text("Intensity of Brown is proportional to no. of Infected");
  
  
}

//heatmap functions end

function drawGraph_vis1(){

  var div = d3.select("#tooltip_vis1")
    .attr("class", "tooltip_vis1")
    .style("opacity", 1);

  var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1100 - margin.left - margin.right,
    height = 590 - margin.top - margin.bottom;

mapSvg_vis1.selectAll('*').remove();

  var Data = d3.select("#countries").node().value;
  console.log(Data+"Data")
  var thailandData
  if (Data == 'thailand'){
    thailandData = thailand
  }
  else if (Data=='aleppo') {
    thailandData = aleppoData
  }
  else if (Data=='colombia') {
    thailandData = colombiaData
  }
  else if (Data=='iran') {
    thailandData = iranData
  }
  else if (Data=='karachi') {
    thailandData = karachiData
  }
  else if (Data=='lebanon') {
    thailandData = lebanonData
  }
  else if (Data=='nairobi') {
    thailandData = nairobiData
  }
  else if (Data=='saudiarabia') {
    thailandData = saudiarabiaData
  }
  else if (Data=='turkey') {
    thailandData = turkeyData
  }
  else if (Data=='venezuela') {
    thailandData = venezuelaData
  }
  else if (Data=='yemen'){
    thailandData = yemenData
  }
  else{
    thailandData = allData
  }
console.log(thailandData)
  var array = []
  d3.map(thailandData,function(d){
    array.push(d['Hospitalized'])
  })
  console.log(array)

  var time = d3.map(thailandData,function(d){
        return d['DATE']
  }).keys()
  console.log(time)

  var avg = d3.map(thailandData,function(d){
    return d['Moving_Avg_Window_5']
  }).keys()
  console.log(avg)

var death = []
  thailandData.forEach(d=>{
    death.push(d['Death_Moving_Avg_Window_5'])
  })

  var death_org = []
    thailandData.forEach(d=>{
      death_org.push(d['Death_Count'])
    })

  var arr = []
  for(var i=0;i<time.length;i++){
    arr.push([array[i],time[i],avg[i],death[i],death_org[i]])
  }
  console.log(arr)

  marg = margin.left + 20
  var svg_vis1 = d3.select(".graph")
    .append("svg")
      .attr("width", width + margin.left + margin.right+60)
      .attr("height", height + margin.top + margin.bottom+120)
    .append("g")
      .attr("transform",
            "translate(" + marg + "," + margin.top + ")");

  var x = d3.scaleBand()
    .domain(thailandData.map(function(d) { return d['DATE'];}))
    .range([ 0, width ]);
  svg_vis1.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x)
            .ticks(5)
            .tickFormat(function (d) {
              vis1_count += 1
              if (vis1_count % 3 == 0){
                var longDateStr = moment(d, 'M/D/Y').format('MMMM D');
                return longDateStr;
              }
                  }))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, d3.max(array, function(d) {   return +d; })])
    .range([ height, 0]);
  svg_vis1.append("g")
  .transition()
.duration(2000)
    .call(d3.axisLeft(y));
  // xscale for line drawGraph

  const g = svg_vis1.append('g')
                .attr('transform', `translate(${0}, ${0})`);

  var barchart = g.selectAll("rect")
                  .data(arr)
                  .enter()
                  .append("g")

  barchart.append('rect')
          .attr("x", function(d) { return x(d[1]); })
          .attr("y", function(d) { return y(d[0]); })
          .transition()
.duration(2000)
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d[0]);})
          .style("opacity", 0.5)
          .style("fill", "#87CEFA");

console.log(arr)

    var line = d3.line()
    .x(function(d, i) {
      return x(d[1]) + x.bandwidth() / 2; })
    .y(function(d) { return y(d[2]); })
    .curve(d3.curveMonotoneX);


    barchart.append("path")
    .attr("class", "line")
    .transition()
.duration(3000) // Assign a class for styling
    .attr("d", line(arr))
    .attr("fill","none")
    .style("opacity",0.4)
    svg_vis1.selectAll('dot')
    .data(arr)
    .enter()
    .append('circle')
    .attr('r',5)
    .style("opacity",0.3)
    .attr('cx', function(d){return x(d[1])+4.5;})
    .attr('cy', function(d) {return y(d[2]);})
    .attr('fill', 'blue')
    .on('mouseover', function(d) {

    div.transition()
       .duration(50)
       .style('opacity',1)
  div.html("Hospitalized:" +Math.round(+d[2]))
   .style("left", (d3.event.pageX + 15) + "px")
   .style("top", (d3.event.pageY - 50) + "px")
   .style("display","inline");
  })
  .on('mouseout', function(d,i) {
    d3.select(this).transition()
    .duration('50')
    .attr('opacity','1')
    .attr("stroke-width", 1)
    .style("stroke", "black")
    div.transition()
       .duration(50)
       .style('opacity',0)
  });



  var barchart1 = g.selectAll("rect")
                  .data(arr)
                  .enter()
                  .append("g")

  barchart1.append('rect')
          .attr("x", function(d) { console.log(d)
            return x(d[1]); })
          .attr("y", function(d) { return y(d[4]); })
          .attr("width", x.bandwidth())
          .attr("height", function(d) { return height - y(d[4]);})
          .style("opacity", 0.5)
          .style("fill", "Red");

    var line1 = d3.line()
    .x(function(d, i) {
      return x(d[1]) + x.bandwidth() / 2; })
    .y(function(d) { return y(d[3]); })
    .curve(d3.curveMonotoneX);

    barchart.append("path")
    .attr("class", "line1") // Assign a class for styling
    .attr("d", line1(arr))
    .attr("fill","none")
    .style("opacity",0.4);
    svg_vis1.selectAll('dot')
    .data(arr)
    .enter()
    .append('circle')
    .attr('r',5)
    .style("opacity",0.3)
    .attr('cx', function(d){return x(d[1])+4.5;})
    .attr('cy', function(d) {return y(d[3]);})
    .attr('fill', 'red')
    .on('mouseover', function(d) {

    div.transition()
       .duration(50)
       .style('opacity',1)
  div.html("Deaths:" +Math.round(+d[3]))
   .style("left", (d3.event.pageX + 15) + "px")
   .style("top", (d3.event.pageY - 50) + "px")
   .style("display","inline");
  })
  .on('mouseout', function(d,i) {
    d3.select(this).transition()
    .duration('50')
    .attr('opacity','1')
    .attr("stroke-width", 1)
    .style("stroke", "black")
    div.transition()
       .duration(50)
       .style('opacity',0)
  });
;
     // 11. Calls the line generator

  svg_vis1.append("text")
      .attr("transform","translate("+ (width/2) +" ,"+ (height+margin.top + 50) +")")
      .style("font-weight",700)
      .text("Timeline")
      .attr("fill","black")
      .attr("font-size",18)
      .style("opacity",0.8);

  svg_vis1.append("text")
      .attr("transform","rotate(-90)")
      .attr("y",0 - margin.left/0.9)
      .attr("x",0 - (height/1.18))
      .attr("dy","1em")
      .attr("font-family","sans-serif")
      .style("font-weight",600)
      .style("opacity",0.8)
      .attr("font-size",18)
      .text("Number of Patients(Hospitalized and Died)")
      .style("fill","black")

      svg_vis1.append('line')
                   .attr('x1', 400)
                   .attr('y1', -440)
                   .attr('x2', 420)
                   .attr('y2', -440)
                   .attr("transform", "translate(430,450)")
                   .style("stroke","red")
                   .style("stroke-width",5)
                   .attr("stroke",'red')
                   .style("opacity",1);
       svg_vis1.append("text")
                   .attr('x', 450)
                   .attr('y', -440)
                   .text("Deaths")
                   .attr("transform", "translate(410,455)")
                   .style("fill","#ff304f")
                   .style("stroke","black")
                   .style("opacity",0.9);
     svg_vis1.append('line')
                  .attr('x1', 400)
                  .attr('y1', -410)
                  .attr('x2', 420)
                  .attr('y2', -410)
                  .attr("transform", "translate(430,450)")
                  .style("stroke","blue")
                  .style("stroke-width",5)
                  .attr("stroke",'red')
                  .style("opacity",1);
      svg_vis1.append("text")
                  .attr('x',450)
                  .attr('y', -410)
                  .text("Hospitalized")
                  .attr("transform", "translate(410,455)")
                  .style("fill","#ff304f")
                  .style("stroke","black")
                  .style("opacity",0.9);


}


//Visulization -2 (Stacked Bar chart functions) starts
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function age_value(d) {
    if(d.data["dead_R1"] == (d[1]-d[0])) return "0-30 years";
    else if(d.data["dead_R2"] == (d[1]-d[0])) return "30-60 years";
    else if(d.data["dead_R3"] == (d[1]-d[0])) return ">60 years";
    else if(d.data["hosp_R1"] == (d[1]-d[0])) return "0-30 years";
    else if(d.data["hosp_R2"] == (d[1]-d[0])) return "30-60 years";
    else if(d.data["hosp_R3"] == (d[1]-d[0])) return ">60 years";
}

function return_count(d) {
    return d[1]-d[0];
}

function initvariables() {

    yLabels_symp = function(dt){
        return yScale(dt.symptoms);
    }
    
    xScaleFrom = d3.scaleLinear()
            .domain(d3.extent(count_dead_hosp, function(dt){
                return dt.count_hosp;
                }))
            .range([0, innerwidth_vis2/2-40]);
    //[d3.max(count_dead_hosp, function(d) { return  d.count_hosp; }), d3.min(count_dead_hosp, function(d) { return  d.count_hosp; })]
    xScaleTo = d3.scaleLinear()
            .domain(d3.extent(count_dead_hosp, function(dt){
                return dt.count_dead;
                }))
            .range([0, innerwidth_vis2/2-90]);
    
    yScale = d3.scaleBand()
            .domain(count_dead_hosp.map(function(dt){
                return dt.symptoms; 
                }))
            .range([0, innerHeight_vis2])
            .padding(0.1);
}

function drawMap() {
  console.log("In drawMap");
    svgVis2.selectAll('*').remove();
    // console.log("printng stack info :",d3.stack().keys(["hosp_R1","hosp_R2","hosp_R3"])(count_dead_hosp))
    const g = svgVis2.append('g')
    .attr('transform', 'translate('+margin_vis2.left+', '+margin_vis2.top+')');

    var barChart1 = g.selectAll('rect.left')
            .data(d3.stack().keys(keys_hosp)(count_dead_hosp))
            .enter()
            .append('g')
            .attr('fill', function(d,i){
                if(d.key=="hosp_R1") return "steelblue";
                else if(d.key=="hosp_R2") return "lightgreen";
                else return "lightblue";
            })
            .selectAll('rect')
            .data(function(d){
                return d;
            })
            .enter()
            .append('rect')
            .attr('x', function(d){return xScaleFrom(d[0])+100;})
            .attr('y', function(d) {return yScale(d.data.Symptom)})
            .attr('class', 'left')
            .attr('width', function(dt){
                return xScaleFrom(dt[1]-dt[0]);
            })
            .attr('height', yScale.bandwidth())
            .on('mouseover',function(d){
                divtool.transition()
                        .duration(500)
                        .style("opacity",0.9);
                divtool.html("Age : "+ age_value(d) +"<br>"+" Count: "+ return_count(d)+"<br>")
                    .style("left",(d3.event.pageX)+"px")
                    .style("top",(d3.event.pageY)+"px")
                    .style("background","white")
                    .style("display","inline")
                    .style("opacity",1);
            })
            .on('mouseout', function(d) {
                divtool.transition()
                        .duration(500)
                        .style("opacity",0);
            });
        
        g.selectAll("rect.right")
            .data(d3.stack().keys(keys_dead)(count_dead_hosp))
            .enter()
            .append('g')
            .attr('fill', function(d,i){
                if(d.key=="dead_R1") return "#f5c16c";
                else if(d.key=="dead_R2") return "#e60626";
                else return "orange";
            })
            .selectAll('rect')
            .data(function(d){
                return d;
            })
            .enter()
            .append('rect')
            .attr('x', function(d){return xScaleTo(d[0])+560;})
            .attr('y', function(d) {return yScale(d.data.Symptom)})
            .attr('class', 'right')
            .attr('width', function(dt){
                return (xScaleTo(dt[1]-dt[0]));
            })
            .attr('height', yScale.bandwidth()-2)
            .on('mouseover',function(d){
                divtool.transition()
                        .duration(500)
                        .style("opacity",0.9);
            divtool.html("Age : "+ age_value(d) +"<br>"+" Count: "+ return_count(d)+"<br>")
                    .style("left",(d3.event.pageX)+"px")
                    .style("top",(d3.event.pageY)+"px")
                    .style("background","white")
                    .style("display","inline")
                    .style("opacity",1);
            })
            .on('mouseout', function(d) {
                divtool.transition()
                        .duration(500)
                        .style("opacity",0);
            });

        g.selectAll('text.name')
            .data(count_dead_hosp)
            .enter().append("text")
            .attr("x", 60)
            .attr("y", function (d) {
                return yScale(d.symptoms)+7;
            })
            .attr("dy", ".40em")
            .attr("float","right")
            .attr("dy", ".80em")
            .attr("text-anchor", "end")
            .attr('class', 'name')
            .attr('fill','brown')
            .attr('stroke','grey')
            .attr('stroke-width','0.2px')
            .style('font-family', '"Open Sans", sans-serif')
            .style('font-weight', '500')
            .attr('font-size','0.8em')
            .text(function(d){return d.symptoms;});

            g.append('text')
            .attr('x',-40)
            .attr('y',-30)
            .style('font-size', "1.1em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('SYMPTOMS');
           
            g.append('text')
            .attr('x',100)
            .attr('y',-30)
            .style('font-size', "1.1em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('HOSPITALIZED');

            g.append('text')
            .attr('x',558)
            .attr('y',-30)
            .style('font-size', "1em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('DEAD');

            g.append("rect")
            .attr("x",97)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr('stroke','grey')
            .style("fill", "steelblue");
            g.append('text')
            .attr('x',132)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 0 to 30');
            g.append('text')
            .attr('x',132)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Hospitalized (Alive)');

            g.append("rect")
            .attr("x",240)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr('stroke','grey')
            .style("fill", "lightgreen");
            g.append('text')
            .attr('x',275)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 30 to 60');
            g.append('text')
            .attr('x',275)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Hospitalized (Alive)');

            g.append("rect")
            .attr("x",370)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr('stroke','grey')
            .style("fill", "lightblue");
            g.append('text')
            .attr('x',405)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: > 60');
            g.append('text')
            .attr('x',405)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Hospitalized (Alive)');




            g.append("rect")
            .attr("x",560)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr("stroke","grey")
            .style("fill", "#f5c16c");
            g.append('text')
            .attr('x',595)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 0 to 30');
            g.append('text')
            .attr('x',595)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('DEAD');
            g.append("rect")
            .attr("x",710)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr("stroke","grey")
            .style("fill", "#e60626");
            g.append('text')
            .attr('x',745)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 30 to 60');
            g.append('text')
            .attr('x',745)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('DEAD');

            g.append("rect")
            .attr("x",855)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr("stroke","grey")
            .style("fill", "orange");
            g.append('text')
            .attr('x',890)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: > 60');
            g.append('text')
            .attr('x',890)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('DEAD');
            // .on("mouseover", function(d) {   
            //     div.transition()   
            //         .duration(100)   
            //         .style("opacity", .9);   
            //     div.html('Dog has died') 
            //         .style("left", (d3.event.pageX) + "px")    
            //         .style("top", (d3.event.pageY - 28) + "px"); 
            //     })         
            // .on("mouseout", function(d) {    
            //     div.transition()   
            //         .duration(500)   
            //         .style("opacity", 0);  
            // });
            // #f5c16c";
            // else if(d.key=="dead_R2") return "#e60626";
            // else return "orange";

}

function drawMap_male() {
    svgVis2.selectAll('*').remove();
    const g = svgVis2.append('g')
    .attr('transform', 'translate('+margin_vis2.left+', '+margin_vis2.top+')');

    var barChart1 =g.selectAll('rect.left')
                .data(d3.stack().keys(keys_hosp)(male_count_dead_hosp))
                .enter()
                .append('g')
                .attr('fill', function(d,i){
                    if(d.key=="hosp_R1") return "steelblue";
                    else if(d.key=="hosp_R2") return "lightgreen";
                    else return "lightblue";
                })
                .selectAll('rect')
                .data(function(d){
                    return d;
                })
                .enter()
                .append('rect')
                .attr('x', function(d){return xScaleFrom(d[0])+100;})
                .attr('y', function(d) {return yScale(d.data.Symptom)})
                .attr('class', 'left')
                .attr('width', function(dt){
                    return xScaleFrom(dt[1]-dt[0]);
                })
                .attr('height', yScale.bandwidth())
                .on('mouseover',function(d){
                    divtool.transition()
                            .duration(500)
                            .style("opacity",0.9);
                    divtool.html("Age : "+ age_value(d) +"<br>"+" Count: "+ return_count(d)+"<br>")
                        .style("left",(d3.event.pageX)+"px")
                        .style("top",(d3.event.pageY)+"px")
                        .style("background","white")
                        .style("display","inline")
                        .style("opacity",1);
                })
                .on('mouseout', function(d) {
                    divtool.transition()
                            .duration(500)
                            .style("opacity",0);
                });
        
        g.selectAll("rect.right")
                .data(d3.stack().keys(keys_dead)(male_count_dead_hosp))
                .enter()
                .append('g')
                .attr('fill', function(d,i){
                    if(d.key=="dead_R1") return "#f5c16c"
                    else if(d.key=="dead_R2") return "#e60626";
                    else return "orange";
                })
                .selectAll('rect')
                .data(function(d){
                    return d;
                })
                .enter()
                .append('rect')
                .attr('x', function(d){return xScaleTo(d[0])+560;})
                .attr('y', function(d) {return yScale(d.data.Symptom)})
                .attr('class', 'right')
                .attr('width', function(dt){
                    return (xScaleTo(dt[1]-dt[0]));
                })
                .attr('height', yScale.bandwidth())
                .on('mouseover',function(d){
                    divtool.transition()
                            .duration(500)
                            .style("opacity",0.9);
                    divtool.html("Age : "+ age_value(d) +"<br>"+" Count: "+ return_count(d)+"<br>")
                        .style("left",(d3.event.pageX)+"px")
                        .style("top",(d3.event.pageY)+"px")
                        .style("background","white")
                        .style("display","inline")
                        .style("opacity",1);
                })
                .on('mouseout', function(d) {
                    divtool.transition()
                            .duration(500)
                            .style("opacity",0);
                });

        g.selectAll('text.name')
            .data(male_count_dead_hosp)
            .enter().append("text")
            .attr("x", 60)
            .attr("y", function (d) {
                return yScale(d.symptoms)+7;
            })
            .attr("text-transform","uppercase")
            .attr("float","right")
            .attr("dy", ".80em")
            .attr("text-anchor", "end")
            .attr('class', 'name')
            .attr('fill','brown')
            .attr('stroke','grey')
            .attr('stroke-width','0.2px')
            .style('font-family', '"Open Sans", sans-serif')
            .style('font-weight', '500')
            .attr('font-size','0.8em')
            .text(function(d){return d.symptoms;});

            g.append('text')
            .attr('x',-40)
            .attr('y',-30)
            .style('font-size', "1.1em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('SYMPTOMS');
           
            g.append('text')
            .attr('x',100)
            .attr('y',-30)
            .style('font-size', "1.1em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('HOSPITALIZED');

            g.append('text')
            .attr('x',558)
            .attr('y',-30)
            .style('font-size', "1em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('DEAD');

            g.append("rect")
            .attr("x",97)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr('stroke','grey')
            .style("fill", "steelblue");
            g.append('text')
            .attr('x',132)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 0 to 30');
            g.append('text')
            .attr('x',132)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Hospitalized (Alive)');

            g.append("rect")
            .attr("x",240)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr('stroke','grey')
            .style("fill", "lightgreen");
            g.append('text')
            .attr('x',275)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 30 to 60');
            g.append('text')
            .attr('x',275)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Hospitalized (Alive)');

            g.append("rect")
            .attr("x",370)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr('stroke','grey')
            .style("fill", "lightblue");
            g.append('text')
            .attr('x',405)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: > 60');
            g.append('text')
            .attr('x',405)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Hospitalized (Alive)');




            g.append("rect")
            .attr("x",560)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr("stroke","grey")
            .style("fill", "#f5c16c");
            g.append('text')
            .attr('x',595)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 0 to 30');
            g.append('text')
            .attr('x',595)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Dead');
            g.append("rect")
            .attr("x",710)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr("stroke","grey")
            .style("fill", "#e60626");
            g.append('text')
            .attr('x',745)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 30 to 60');
            g.append('text')
            .attr('x',745)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('DEAD');

            g.append("rect")
            .attr("x",855)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr("stroke","grey")
            .style("fill", "orange");
            g.append('text')
            .attr('x',890)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: > 60');
            g.append('text')
            .attr('x',890)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('DEAD');
}

function drawMap_female() {
    svgVis2.selectAll('*').remove();
    const g = svgVis2.append('g')
    .attr('transform', 'translate('+margin_vis2.left+', '+margin_vis2.top+')');

    var barChart1 = g.selectAll('rect.left')
            .data(d3.stack().keys(keys_hosp)(female_count_dead_hosp))
            .enter()
            .append('g')
            .attr('fill', function(d,i){
                if(d.key=="hosp_R1") return "steelblue";
                else if(d.key=="hosp_R2") return "lightgreen";
                else return "lightblue";
            })
            .selectAll('rect')
            .data(function(d){
                return d;
            })
            .enter()
            .append('rect')
            .attr('x', function(d){return xScaleFrom(d[0])+100;})
            .attr('y', function(d) {return yScale(d.data.Symptom)})
            .attr('class', 'left')
            .attr('width', function(dt){
                return xScaleFrom(dt[1]-dt[0]);
            })
            .attr('height', yScale.bandwidth())
            .on('mouseover',function(d){
                divtool.transition()
                        .duration(500)
                        .style("opacity",0.9);
                divtool.html("Age : "+ age_value(d) +"<br>"+" Count: "+ return_count(d)+"<br>")
                    .style("left",(d3.event.pageX)+"px")
                    .style("top",(d3.event.pageY)+"px")
                    .style("background","white")
                    .style("display","inline")
                    .style("opacity",1);
            })
            .on('mouseout', function(d) {
                divtool.transition()
                        .duration(500)
                        .style("opacity",0);
            });
                
        g.selectAll("rect.right")
            .data(d3.stack().keys(keys_dead)(female_count_dead_hosp))
            .enter()
            .append('g')
            .attr('fill', function(d,i){
                if(d.key=="dead_R1") return "#f5c16c";
                else if(d.key=="dead_R2") return "#e60626";
                else return "orange";
            })
            .selectAll('rect')
            .data(function(d){
                return d;
            })
            .enter()
            .append('rect')
            .attr('x', function(d){return xScaleTo(d[0])+560;})
            .attr('y', function(d) {return yScale(d.data.Symptom)})
            .attr('class', 'right')
            .attr('width', function(dt){
                return (xScaleTo(dt[1]-dt[0]));
            })
            .attr('height', yScale.bandwidth()+2)
            .on('mouseover',function(d){
                divtool.transition()
                        .duration(500)
                        .style("opacity",0.9);
                divtool.html("Age : "+ age_value(d) +"<br>"+" Count: "+ return_count(d)+"<br>")
                    .style("left",(d3.event.pageX)+"px")
                    .style("top",(d3.event.pageY)+"px")
                    .style("background","white")
                    .style("display","inline")
                    .style("opacity",1);
            })
            .on('mouseout', function(d) {
                divtool.transition()
                        .duration(500)
                        .style("opacity",0);
            });

        g.selectAll('text.name')
            .data(female_count_dead_hosp)
            .enter().append("text")
            .attr("x", 60)
            .attr("y", function (d) {
                return yScale(d.symptoms)+7;
            })
            .attr("float","right")
            .attr("dy", ".80em")
            .attr("text-anchor", "end")
            .attr('class', 'name')
            .attr('fill','brown')
            .attr('stroke','grey')
            .attr('stroke-width','0.2px')
            .style('font-family', '"Open Sans", sans-serif')
            .style('font-weight', '500')
            .attr('font-size','0.8em')
            .text(function(d){return d.symptoms;});

            g.append('text')
            .attr('x',-40)
            .attr('y',-30)
            .style('font-size', "1.1em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('SYMPTOMS');
           
            g.append('text')
            .attr('x',100)
            .attr('y',-30)
            .style('font-size', "1.1em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('HOSPITALIZED');

            g.append('text')
            .attr('x',558)
            .attr('y',-30)
            .style('font-size', "1em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('DEAD');

            g.append("rect")
            .attr("x",97)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr('stroke','grey')
            .style("fill", "steelblue");
            g.append('text')
            .attr('x',132)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 0 to 30');
            g.append('text')
            .attr('x',132)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Hospitalized (Alive)');

            g.append("rect")
            .attr("x",240)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr('stroke','grey')
            .style("fill", "lightgreen");
            g.append('text')
            .attr('x',275)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 30 to 60');
            g.append('text')
            .attr('x',275)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Hospitalized (Alive)');

            g.append("rect")
            .attr("x",370)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr('stroke','grey')
            .style("fill", "lightblue");
            g.append('text')
            .attr('x',405)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: > 60');
            g.append('text')
            .attr('x',405)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Hospitalized (Alive)');




            g.append("rect")
            .attr("x",560)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr("stroke","grey")
            .style("fill", "#f5c16c");
            g.append('text')
            .attr('x',595)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 0 to 30');
            g.append('text')
            .attr('x',595)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Dead');
            g.append("rect")
            .attr("x",710)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr("stroke","grey")
            .style("fill", "#e60626");
            g.append('text')
            .attr('x',745)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: 30 to 60');
            g.append('text')
            .attr('x',745)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('DEAD');

            g.append("rect")
            .attr("x",855)
            .attr("y",465)
            .attr('width','30')
            .attr('height','30')
            .attr('stroke','#522e24')
            .attr("stroke-width", 2)
            .attr("stroke","grey")
            .style("fill", "orange");
            g.append('text')
            .attr('x',890)
            .attr('y',474)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('Age: > 60');
            g.append('text')
            .attr('x',890)
            .attr('y',492)
            .style('font-size', "0.6em")
            .style('fill','brown')
            .style("font-weight", 'bold')
            .text('DEAD');

}

//Visualization -2 functions ends


function vis2(){
  console.log("In Vis2")
  divtool = d3.select("#tooltip")
                .attr("class","tooltip")
                .style("opacity",0)
    svgVis2 = d3.select('#vis2');
    console.log("In Vis2 DOM")
    width_vis2 = 550;
    height_vis2 = 550;
    margin_vis2 = { top:75, bottom: 60, right: 20, left: 90 };
    innerwidth_vis2 = width_vis2 - margin_vis2.left - margin_vis2.right;
    innerHeight_vis2 = height_vis2 - margin_vis2.top - margin_vis2.bottom;
    // Load both files before doing anything else
    d3.csv('/data/vis2Data.csv').then(function(values){
        data = values;
        data.forEach(d=> {
            d.symptoms = d["Symptom"];
            all_symptoms.push(d.symptoms);
            d.count = +d["count"];
            d.gender = d["GENDER"];
            d.death = d["DEATH"];
            d.age_range = d["AGE_Range"];
        });
        unique_symptoms = all_symptoms.filter(onlyUnique);
        for(var i=0;i<data.length;i++){
            if(data[i]['DEATH']==1){
                data_dead.push(data[i]);
                if(data[i]["GENDER"]=='M') { male_data_dead.push(data[i]);}
                else { female_data_dead.push(data[i]);}
            }
            else {
                data_hosp.push(data[i]);
                if(data[i]["GENDER"]=='M') { male_data_hosp.push(data[i]);}
                else { female_data_hosp.push(data[i]);}
            }
        }
        for(var i=0;i<unique_symptoms.length;i++){
            var temp_dead = 0,temp_male_dead=0,temp_female_dead=0;
            var temp_hosp = 0,temp_male_hosp=0,temp_female_hosp=0;
            var mr1 = 0, fr1 = 0,mr2 = 0, fr2 = 0, mr3 = 0, fr3 = 0, r1 = 0, r2 = 0, r3 = 0; 
            for(var j=0;j<data_dead.length;j++){
                var cond1 = (unique_symptoms[i]===data_dead[j]["Symptom"]);
                if(cond1){
                    var c = +data_dead[j]["count"];
                    temp_dead = temp_dead+c;
                    if(data_dead[j]["GENDER"]=="M"){
                        var m = +data_dead[j]["count"];
                        temp_male_dead = temp_male_dead+m;
                        if(data_dead[j]["AGE_Range"]=='R1') mr1 += m;
                        else if(data_dead[j]["AGE_Range"]=='R2') mr2 += m;
                        else mr3 += m;
                    }
                    else{
                        var f = +data_dead[j]["count"];
                        temp_female_dead = temp_female_dead+f;
                        if(data_dead[j]["AGE_Range"]=='R1') fr1 += f;
                        else if(data_dead[j]["AGE_Range"]=='R2') fr2 += f;
                        else fr3 += f;
                    }
                    r1 = mr1+fr1;
                    r2 = mr2+fr2;
                    r3 = mr3+fr3;
                }
            }
            var hmr1 = 0, hfr1 = 0,hmr2 = 0, hfr2 = 0, hmr3 = 0, hfr3 = 0, hr1 = 0, hr2 = 0, hr3 = 0; 
            for(var j=0;j<data_hosp.length;j++){
                var cond2 = (unique_symptoms[i]===data_hosp[j]["Symptom"]);
                if(cond2){
                    var c = +data_hosp[j]["count"];
                    temp_hosp = temp_hosp+c;
                    if(data_hosp[j]["GENDER"]=="M"){
                        var m = +data_hosp[j]["count"];
                        temp_male_hosp = temp_male_hosp+m;
                        if(data_hosp[j]["AGE_Range"]=='R1') hmr1 += m;
                        else if(data_hosp[j]["AGE_Range"]=='R2') hmr2 += m;
                        else hmr3 += m;
                    }
                    else{
                        var f = +data_hosp[j]["count"];
                        temp_female_hosp = temp_female_hosp+f;
                        if(data_hosp[j]["AGE_Range"]=='R1') hfr1 += f;
                        else if(data_hosp[j]["AGE_Range"]=='R2') hfr2 += f;
                        else hfr3 += f;
                    }
                    hr1 = hmr1+hfr1;
                    hr2 = hmr2+hfr2;
                    hr3 = hmr3+hfr3;
                }
            }
            count_dead_hosp.push({
                Symptom: unique_symptoms[i],
                count_dead: temp_dead,
                count_hosp: temp_hosp,
                dead_R1: r1,
                dead_R2: r2,
                dead_R3: r3,
                hosp_R1: hr1,
                hosp_R2: hr2,
                hosp_R3: hr3
            });
            male_count_dead_hosp.push({
                Symptom: unique_symptoms[i],
                count_dead: temp_male_dead,
                count_hosp: temp_male_hosp,
                dead_R1: mr1,
                dead_R2: mr2,
                dead_R3: mr3,
                hosp_R1: hmr1,
                hosp_R2: hmr2,
                hosp_R3: hmr3
            });
            female_count_dead_hosp.push({
                Symptom: unique_symptoms[i],
                count_dead: temp_female_dead,
                count_hosp: temp_female_hosp,
                dead_R1: fr1,
                dead_R2: fr2,
                dead_R3: fr3,
                hosp_R1: hfr1,
                hosp_R2: hfr2,
                hosp_R3: hfr3
            });
        }
    
        count_dead_hosp.forEach(dt=> {
            dt.symptoms = dt["Symptom"];
            dt.count_hosp = +dt["count_hosp"];
            dt.count_dead = +dt["count_dead"];
        });

        male_count_dead_hosp.forEach(dt=> {
            dt.symptoms = dt["Symptom"];
            dt.count_hosp = +dt["count_hosp"];
            dt.count_dead = +dt["count_dead"];
        });

        female_count_dead_hosp.forEach(dt=> {
            dt.symptoms = dt["Symptom"];
            dt.count_hosp = +dt["count_hosp"];
            dt.count_dead = +dt["count_dead"];
        });
        initvariables();
        drawMap();
    });
}


function vis3(val)
{
  d3.select("#vis3")
    .selectAll("svg")
    .remove();

  d3.select("#vis3")
    .selectAll("#mylabels")
    .remove();


const margin = {top: 100, right: 20, bottom: 50, left: 100};
const width = 800 - margin.left - margin.right;
const height = 470 - margin.top - margin.bottom;

countryVal = d3.select("#countries").node().value;
// genderVal = d3.select("#gender_selection").node().value;

genderVal = d3.select('input[name="gender"]:checked').node().value


var dataset;

console.log(genderVal);

if(genderVal == "all"){
  dataset = d3.csv("data/Vis3Data.csv");
}
else if(genderVal == "male"){
  dataset = d3.csv("data/Vis3DataMale.csv");
}
else{
  dataset = d3.csv("data/Vis3DataFemale.csv");
}

dataset.then(function(data) {
    var slices = data.columns.slice(1).map(function(id) {
      return {
            id: id,
            values: data.map(function(d){
                return {
                    day: +d["Day"],
                    deaths: +d[id]
                };
            })
        };
        
    });

    if(countryVal != "all"){
      // console.log(countryVal);
      slices = slices.filter(function(d){
                  return  (d.id == countryVal)
              })
    }

    
// console.log("Column headers", data.columns);
// // console.log("Column headers without date", data.columns.slice(1));
// // returns the sliced dataset
// console.log("Slices",slices);  
// // returns the first slice
// console.log("First slice",slices[0]);
// // returns the array in the first slice
// console.log("A array",slices[0].values);   
// // returns the date of the first row in the first slice
// console.log("Date element",slices[0].values[0].day);  
// // returns the array's length
// console.log("Array length",(slices[0].values).length);

const xScale = d3.scaleLinear().range([0,width]);
const yScale = d3.scaleLinear().rangeRound([height, 0]);

xScale.domain([(1), d3.max(slices, function(c) {
    return d3.max(c.values, function(d) {
        return d.day; });
        })
    ]);

yScale.domain([(0), d3.max(slices, function(c) {
    return d3.max(c.values, function(d) {
        return d.deaths + 4; });
        })
    ]);


const yaxis = d3.axisLeft().scale(yScale); 
const xaxis = d3.axisBottom().scale(xScale);
var color = d3.scaleOrdinal().range(d3.schemePaired); // schemeCategory10

color.domain(slices);

var svg = d3.select("#vis3").append("svg")
                           .attr("width", width + margin.left + margin.right)
                           .attr("height", height + margin.top + margin.bottom)
                           .append("g")
                           .attr("transform", `translate(${margin.left},${margin.top})`);


svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xaxis);

svg.append("g")
    .attr("class", "axis")
    .call(yaxis)
    .append("text")


    const line = d3.line().curve(d3.curveMonotoneX)
    .x(function(d) { return xScale(d.day); })
    .y(function(d) { return yScale(d.deaths); });


    const lines = svg.selectAll("lines")
    .data(slices)
    .enter()
    .append("g");

    lines.append("path")
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) {
      // console.log(color(d.id))
      return color(d.id);
    })
    .attr("fill","none")
    .on('mouseover', function(d,i) {     
    })
    .on('mousemove',function(d,i) {
      d3.select(this)
            .style("stroke-width", "4");
    })
    .on('mouseout', function(d,i) {
      d3.select(this).transition()
               .duration('50')
               .attr('opacity', '1')
               .style("stroke-width", "1");
    })


    svg.append("text")
    .attr("text-anchor", "middle")
    // .attr("stroke", "gray")
    .attr("x", width/2)
    .attr("y", height + 40)
    .text("Day span (from hospitalized day)")
    .style("font-size","14px")
    .style("font-family","sans-serif"); 

    svg.append("text")
    .attr("text-anchor", "middle")
    // .attr("stroke", "gray")
    .attr("transform", "rotate(-90)")
    .attr("y", - margin.left + 40)
    .attr("x", - height/2 )
    .text("Deaths")
    .style("font-size","14px")
    .style("font-family","sans-serif");

    var labelsSvg = d3.select("#vis3").append("svg")
    const size = 20;

    labelsSvg.selectAll("mydots")
        .data(slices)
        .enter()
        .append("rect")
        .attr("x", width + 200)
        .attr("y", function(d,i){ return 100 + i*(size+5)}) 
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d.id)})


    labelsSvg.selectAll("mylabels")
        .data(slices)
        .enter()
        .append("text")
        .attr("x", width + 235)
        .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)})
        .style("fill", function(d){ return color(d.id)})
        .style('stroke','black')
        .style('stroke-width','0.2px')
        .text(function(d){ 
          if(d.id == "saudiarabia"){
            return "Saudi Arabia"
          }
          else{
            return d.id.charAt(0).toUpperCase() + d.id.substring(1);
          }
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
    
});

}