import{S as f,i as _,s as g,O as y,l as m,m as b,n as h,h as n,p,q as d,b as v,I as w,Q as C,R as A,T as D,f as E,t as S,K as k}from"./index-cfd5f23c.js";const j={light:{name:"light",text:"#222",muted:"#777",pale:"#f0f0f0",background:"#fff"},dark:{name:"dark",text:"#fff",muted:"#bbb",pale:"#333",background:"#222"}},x={options:"https://datavis.nisra.gov.uk/techlab/drpvze/places_2001.csv",places:"https://datavis.nisra.gov.uk/techlab/hmmgbq/",base:"https://nisra-tech-lab.github.io/vars-area-explorer/"},N={dea:{name:"District Electoral Area",pl:"District Electoral Areas"},town:{name:"settlement",pl:"Settlement"},lgd:{name:"Local Government District",pl:"Districts"},ward:{name:"Electoral Ward",pl:"Ward"},postcode:{name:"postcode",pl:"postcode"},ctry:{name:"Country",pl:"Countries"}},R={births:[{code:"female",label:"Female"},{code:"male",label:"Male"}],birth_month:[{code:"january",label:"01"},{code:"february",label:"02"},{code:"march",label:"03"},{code:"april",label:"04"},{code:"may",label:"05"},{code:"june",label:"06"},{code:"july",label:"07"},{code:"august",label:"08"},{code:"september",label:"09"},{code:"october",label:"10"},{code:"november",label:"11"},{code:"december",label:"12"}],place_of_death:[{code:"hospital",label:"Hospital"},{code:"care_nursing_home",label:"Care home"},{code:"home",label:"At home"},{code:"hospice",label:"Hospice"},{code:"other",label:"Other"}],age_at_death:[{code:"a1_to_15",label:"1-15"},{code:"a16_to_64",label:"16-64"},{code:"a65_plus",label:"65 plus"}],cause_of_death:[{code:"cancer",label:"Cancer"},{code:"circulatory_diseases",label:"Circulatory diseases"},{code:"respiratory_diseases",label:"Respiratory diseases"},{code:"external_causes",label:"External causes"},{code:"other",label:"Other"}],place_of_death:[{code:"hospital",label:"Hospital"},{code:"care_nursing_home",label:"Care home"},{code:"home",label:"At home"},{code:"hospice",label:"Hospice"},{code:"other",label:"Other"}],marriage_month:[{code:"january",label:"01"},{code:"february",label:"02"},{code:"march",label:"03"},{code:"april",label:"04"},{code:"may",label:"05"},{code:"june",label:"06"},{code:"july",label:"07"},{code:"august",label:"08"},{code:"september",label:"09"},{code:"october",label:"10"},{code:"november",label:"11"},{code:"december",label:"12"}],place_of_marriage:[{code:"approved_venue",label:"Approved venue"},{code:"church",label:"Church"},{code:"registry_office",label:"Registry office"}],ave_age_at_marriage:[{code:"female",label:"Female"},{code:"male",label:"Male"}]},O="https://raw.githubusercontent.com/nisra-explore/map_tiles/main/basemap_styles/style-omt.json",W={lgd:{id:"lgd",promoteId:"LGDCode",type:"vector",url:"https://raw.githubusercontent.com/NISRA-explore/map_tiles/main/lgd2014/{z}/{x}/{y}.pbf",maxzoom:12},dea:{id:"dea",promoteId:"DEA_code",type:"vector",url:"https://raw.githubusercontent.com/NISRA-explore/map_tiles/main/dea_2014/{z}/{x}/{y}.pbf",minzoom:6,maxzoom:12},ward:{id:"ward",promoteId:"Ward_Code",type:"vector",url:"https://raw.githubusercontent.com/NISRA-explore/map_tiles/main/ward2014/{z}/{x}/{y}.pbf",minzoom:6,maxzoom:12}},G={lgd:{source:"lgd",sourceLayer:"lgd",code:"LGDCode",name:"LGDNAME"},dea:{source:"dea",sourceLayer:"dea_2014",code:"DEA_code",name:"DEA"},ward:{source:"ward",sourceLayer:"ward",code:"Ward_Code",name:"Ward_Name"}},H={fill:{"fill-color":"rgba(255,255,255,0)","fill-opacity":0},line:{"line-color":"rgba(255,255,255,0)","line-width":1,"line-opacity":0},"fill-active":{"fill-color":["case",["==",["feature-state","selected"],!0],"rgba(255,255,255,0)","grey"],"fill-opacity":["case",["==",["feature-state","hovered"],!0],.3,["!=",["feature-state","selected"],!0],.1,0]},"fill-self":{"fill-color":["case",["==",["feature-state","selected"],!0],"rgb(143,31,129)","grey"],"fill-opacity":["case",["==",["feature-state","hovered"],!0],.3,.1]},"fill-child":{"fill-color":["case",["==",["feature-state","highlighted"],!0],"rgb(143,31,129)","rgba(255,255,255,0)"],"fill-opacity":["case",["==",["feature-state","hovered"],!0],.3,["==",["feature-state","highlighted"],!0],.1,0]},"line-active":{"line-color":["case",["==",["feature-state","selected"],!0],"rgb(143,31,129)","grey"],"line-width":2,"line-opacity":1},"line-self":{"line-color":"rgb(143,31,129)","line-width":2,"line-opacity":["case",["==",["feature-state","selected"],!0],1,0]},"line-child":{"line-color":"rgb(143,31,129)","line-width":1,"line-opacity":["case",["==",["feature-state","highlighted"],!0],1,0]}};function z(r){let a,o,c,t;const i=r[3].default,l=y(i,r,r[2],null);return{c(){a=m("section"),o=m("div"),l&&l.c(),this.h()},l(e){a=b(e,"SECTION",{style:!0});var s=h(a);o=b(s,"DIV",{class:!0});var u=h(o);l&&l.l(u),u.forEach(n),s.forEach(n),this.h()},h(){p(o,"class",c="col-"+(r[1]=="wide"?"wide":r[1]=="narrow"?"narrow":"medium")),d(a,"color",r[0].text),d(a,"background-color",r[0].background)},m(e,s){v(e,a,s),w(a,o),l&&l.m(o,null),t=!0},p(e,[s]){l&&l.p&&(!t||s&4)&&C(l,i,e,e[2],t?D(i,e[2],s,null):A(e[2]),null),(!t||s&2&&c!==(c="col-"+(e[1]=="wide"?"wide":e[1]=="narrow"?"narrow":"medium")))&&p(o,"class",c),(!t||s&1)&&d(a,"color",e[0].text),(!t||s&1)&&d(a,"background-color",e[0].background)},i(e){t||(E(l,e),t=!0)},o(e){S(l,e),t=!1},d(e){e&&n(a),l&&l.d(e)}}}function I(r,a,o){let{$$slots:c={},$$scope:t}=a,{theme:i=k("theme")}=a,{column:l="medium"}=a;return r.$$set=e=>{"theme"in e&&o(0,i=e.theme),"column"in e&&o(1,l=e.column),"$$scope"in e&&o(2,t=e.$$scope)},[i,l,t,c]}class q extends f{constructor(a){super(),_(this,a,I,z,g,{theme:0,column:1})}}export{q as S,N as a,O as b,R as c,H as d,W as e,G as m,j as t,x as u};
