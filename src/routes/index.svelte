<script context="module">
	export const prerender = true;
</script>
<script>
  import { base } from "$app/paths";
  import { assets } from "$app/paths";
  import { urls } from "$lib/config";
  import Section from "$lib/layout/Section.svelte";
</script>

<svelte:head>
  <title>Census Area Explorer</title>
  <meta name="description" content="">
  <meta property="og:title" content="Census Area Explorer" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{urls.base}/" />
	<meta property="og:description" content="Explore census data for places in Northern Ireland." />
	<meta name="description" content="Explore census data for places in Northern Ireland." />
</svelte:head>

<Section column="wide">
  <div class="block">
    <span class="text-big title">Area Explorer</span>
    <p>Select Northern Ireland or a Local Government District to start exploring vital statistics data</p>
    <ul>
      <li><a href="{base}/N92000002"><strong>Northern Ireland</strong></a></li>
      <ul>
          <li><a href="{base}/N09000001">Antrim and Newtownabbey</a></li>
          <li><a href="{base}/N09000011">Ards and North Down</a></li>
          <li><a href="{base}/N09000002">Armagh City, Banbridge and Craigavon</a></li>
          <li><a href="{base}/N09000003">Belfast</a></li>
          <li><a href="{base}/N09000004">Causeway Coast and Glens</a></li>
          <li><a href="{base}/N09000005">Derry City and Strabane</a></li>
          <li><a href="{base}/N09000006">Fermanagh and Omagh</a></li>
          <li><a href="{base}/N09000007">Lisburn and Castlereagh</a></li>
          <li><a href="{base}/N09000008">Mid and East Antrim</a></li>
          <li><a href="{base}/N09000009">Mid Ulster</a></li>
          <li><a href="{base}/N09000010">Newry, Mourne and Down</a></li>
       </ul>
    </ul>



  </div>
  <div>This application contains data for Northern Ireland, the 11 Local Government Districts and their smaller geographies:  
    DEAs (district electoral areas) and wards.  
  </div>
</Section>

<style>
	.block {
    margin-top: 55px;
    display: block;
	}
	.title {
		display: inline-block;
		margin-top: -3px;
	}
</style>