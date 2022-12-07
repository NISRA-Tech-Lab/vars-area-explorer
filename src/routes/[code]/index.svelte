<script context="module">
	export const prerender = true;
	// getData is a function in utils.js that goes to a url input and looks for a return of csv data
	import { getData } from "$lib/utils";
	// a constant with 3 string urls, options - the places.csv, places - json files for each area code (accessed via urls.places),
	// quantiles - not sure but not used in index currently
	import { urls } from "$lib/config";

	// create a reference to the json for the current area to be loaded - called in the load() func below
	async function loadArea(code, fetch) {
		let res = await fetch(urls.places + code + ".json");
		let json = await res.json();

		return json;
	}

	export async function load({ params, fetch }) {
		let code = params.code;

		let res = await getData(urls.options, fetch);

		let lookup = {};
		res.forEach((d) => (lookup[d.code] = d.name));
		res.forEach((d) => {
			d.typepl = types[d.type].pl;
			d.typenm = types[d.type].name;
			//		  d.typestr = lookup[d.parent] ? `${lookup[d.parent]} includes ${types[d.type].name} within ${lookup[d.parent]}` : '';
			d.typestr = lookup[d.parent]
				? `${types[d.type].name} within ${lookup[d.parent]}`
				: "";
		});

		let options = res.sort((a, b) => a.name.localeCompare(b.name));
		let ew = await loadArea("N92000002", fetch);
		let place = await loadArea(code, fetch);

		return {
			props: { options, place, ew },
		};
	}
</script>

<script>
	import { base } from "$app/paths";
	import { goto } from "$app/navigation";
	import { suffixer, changeClass, changeStr, adjectify } from "$lib/utils";
	import {
		types,
		codes,
		mapStyle,
		mapSources,
		mapLayers,
		mapPaint,
	} from "$lib/config";
	import Section from "$lib/layout/Section.svelte";
	import ColChart from "$lib/chart/ColChart.svelte";
	import StackedBarChart from "$lib/chart/StackedBarChart.svelte";
	import StackedBarChart_nocomparator from "$lib/chart/StackedBarChart_nocomparator.svelte";
	import Em from "$lib/ui/Em.svelte";
	import Select from "$lib/ui/Select.svelte";
	import Map from "$lib/map/Map.svelte";
	import MapSource from "$lib/map/MapSource.svelte";
	import MapLayer from "$lib/map/MapLayer.svelte";
	import GroupChart from "$lib/chart/GroupChart.svelte";
	import AnalyticsBanner from "$lib/layout/AnalyticsBanner.svelte";

	export let options, place, ew;

	let w, cols;
	let map = null;
	let overtime = false;

	let active = {
		selected: null,
		type: null,
		childType: null,
		highlighted: [],
		hovered: null,
	};

	let isChild = {};
	Object.keys(mapLayers).forEach((key) => (isChild[key] = false));

	function makeData(props) {
		const sum = (a, b) => a + b;
		let code = props[0];
		let val = props[1];

		let source = place.data[code][val]["2021"];
		let sourcePrev = place.data[code][val]["2011"];
		let sourceEW = ew.data[code][val]["2021"];

		let keys = codes[code].map((d) => d.code);
		let labels = codes[code].map((d) => (d.label ? d.label : d.code));
		let data = keys.map((key, i) => {
			if (Array.isArray(key)) {
				return {
					x: labels[i],
					y: key.map((k) => source[k]).reduce(sum, 0),
					ew: key.map((k) => sourceEW[k]).reduce(sum, 0),
					prev: key.map((k) => sourcePrev[k]).reduce(sum, 0),
				};
			} else {
				return {
					x: labels[i],
					y: source[key],
					ew: sourceEW[key],
					prev: sourcePrev[key],
				};
			}
		});

		return data;
	}

	function fitMap(bounds) {
		if (map) {
			map.fitBounds(bounds, { padding: 20 });
		}
	}

	function updateActive(place) {
		let prev = JSON.parse(JSON.stringify(active));
		let code = place.code;
		let type = place.type;
		let children = place.children[0]
			? place.children.map((d) => d.code)
			: [];
		let childType =
			place.type == "rgn"
				? "cty"
				: children[0]
				? place.children[0].type
				: null;

		active.selected = code;
		active.type = type;
		active.childType = childType;
		active.highlighted = children;

		let keys = Object.keys(mapLayers);
		let fillProps = ["fill-color", "fill-opacity"];
		let lineProps = ["line-color", "line-width", "line-opacity"];

		// Change layer visibility and paint properties if geography level changes
		if (
			map &&
			(active.type != prev.type || active.childType != prev.childType)
		) {
			// Set map layer visibility properties
			keys.forEach((key) => {
				let visibility =
					key == type || (childType && key == childType)
						? "visible"
						: "none";
				map.setLayoutProperty(key + "-fill", "visibility", visibility);
				map.setLayoutProperty(
					key + "-bounds",
					"visibility",
					visibility
				);
				if (place.parents[0]) {
					map.setLayoutProperty(
						key + "-self",
						"visibility",
						visibility
					);
				}
				isChild[key] = key == childType ? true : false;
			});

			// Set new paint properties
			if (place.parents[0]) {
				fillProps.forEach((prop) =>
					map.setPaintProperty(
						type + "-fill",
						prop,
						mapPaint[children[0] ? "fill-active" : "fill-self"][
							prop
						]
					)
				);
				lineProps.forEach((prop) => {
					map.setPaintProperty(
						type + "-bounds",
						prop,
						mapPaint["line-active"][prop]
					);
					map.setPaintProperty(
						type + "-self",
						prop,
						mapPaint["line-self"][prop]
					);
				});
			}
			if (childType) {
				fillProps.forEach((prop) =>
					map.setPaintProperty(
						childType + "-fill",
						prop,
						mapPaint["fill-child"][prop]
					)
				);
				lineProps.forEach((prop) =>
					map.setPaintProperty(
						childType + "-bounds",
						prop,
						mapPaint["line-child"][prop]
					)
				);
			}
		}
	}

	function update(place) {
		updateActive(place);
		fitMap(place.bounds);
	}

	function mapSelect(ev) {
		goto(`${base}/${ev.detail.code}/`, { noscroll: true });
	}

	function menuSelect(ev) {
		goto(`${base}/${ev.detail.value}/`, { noscroll: true });
	}

	function onResize() {
		cols =
			w < 575
				? 1
				: window
						.getComputedStyle(grid)
						.getPropertyValue("grid-template-columns")
						.split(" ").length;
	}

	$: w && onResize();
	$: chartLabel = overtime
		? "Same area 2011"
		: place && place.parents[0]
		? "NI 2021"
		: null;
	$: place && update(place);
	//	$: hasChange = place && place.data.population.value.change.all != null;
	$: hasChange = false;
	$: noCompare = true;

	$: demog = true;
</script>

<svelte:head>
	<title>{place.name} Census Data</title>
	<meta name="description" content="" />
	<meta property="og:title" content="{place.name} Census Data" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="{urls.base}/{place.code}/" />
	<meta
		property="og:description"
		content="Explore census data for {place.name}."
	/>
	<meta name="description" content="Explore census data for {place.name}." />
</svelte:head>

<Section column="wide">
	{#if place && ew}
		<div class="grid mtl">
			<div>
				<span class="text-small">
					<a href="{base}/" sveltekit:noscroll>Home</a
					>{@html " &gt; "}
					{#if place.parents[0]}
						{#each [...place.parents].reverse() as parent, i}
							<a href="{base}/{parent.code}/" sveltekit:noscroll
								>{parent.name}</a
							>{@html " &gt; "}
						{/each}

						{place.name}
					{:else}
						{place.name}
					{/if}
				</span><br />
				<span class="text-big title">{place.name}</span>
				<div class="text-bold" style="font-size: 0.85em;">
					Click for:
		
					<button
						class="btn"
						class:btn-active={noCompare}
						on:click={() => (noCompare = true)}
						on:click={() => (overtime = false)}
						on:click={() => (hasChange = false)}
						>No comparison</button
					>
					{#if place.type != "ew"}
						<button
							class="btn"
							class:btn-active={hasChange &
								!noCompare &
								!overtime}
							on:click={() => (hasChange = true)}
							on:click={() => (noCompare = false)}
							on:click={() => (overtime = false)}
							>NI 2021</button>
					{/if}
					<button
						class="btn"
						class:btn-active={overtime & !noCompare & !hasChange}
						on:click={() => (overtime = true)}
						on:click={() => (noCompare = false)}
						on:click={() => (hasChange = false)}
						>Same area 2011</button
					>
				</div>
			</div>
			
			<div>
				<div
					style="width: 350px; padding-top: 5px;"
					class:float-right={cols > 1}
				>
					<b>Search for your Local Government District:</b>
					<Select
						{options}
						group="typestr"
						search={true}
						on:select={menuSelect}
					/>

					<!-- Code credit: https://css-tricks.com/on-the-web-share-api/ -->

					<script>
						// Share button
						// Possible tooltip: https://stackoverflow.com/questions/37798967/tooltip-on-click-of-a-button

						function copyToClipboard(text) {
							var inputc = document.body.appendChild(
								document.createElement("input")
							);
							inputc.value = window.location.href;
							inputc.select();
							document.execCommand("copy");
							inputc.parentNode.removeChild(inputc);
							alert("URL Copied.");
						}

						(function (win, doc) {
							const testButton = doc.createElement("button");
							testButton.setAttribute("type", "share");
							if (testButton.type != "share") {
								win.addEventListener("click", function (ev) {
									ev = ev || win.event;
									let target = ev.target;
									let button = target.closest(
										'button[type="share"]'
									);
									if (button) {
										const title = "Share URL";
										const url = win.location.href;
										if (navigator.share) {
											navigator.share({
												title: title,
												url: url,
											});
										} else {
											copyToClipboard();
										}
									}
								});
							}
						})(this, this.document);
					</script>
							

					<!-- 			<button style="cursor: pointer; background-image: url('https://icons.getbootstrap.com/assets/icons/share.svg'); float: right; margin-top: 5px; margin-left: 8px; background-color: transparent !important; background-size: cover; width: 30px; height: 30px; border: 0" type="share"></button>
 -->
					<div width="100%">
						<button
							class="btn"
							style="width: 33%"
							title="Click to print this page to pdf or printer"
							onclick="window.print();return false;"
							>Print / PDF </button>
						<button
							class="btn"
							style="width: 33%"
							alt="Return to the landing page"
							onclick="window.location.href='{base}';"
							>Menu </button>
						<button
							class="btn"
							style="width: 30%"
							type="share"
							alt="Share this page">Share </button>
					</div>
				</div>
			</div>
		</div>

		<div id="grid" class="grid mt">
			<div class="div-grey-box" style="line-height: 1.3;">
				<h3 style="margin: 0 0 10px 0; line-height: 1.78;">Overview</h3>
					The population of {place.name} was  at the time of the 2021 Census.  {place.name} is a {place.type}.  
			</div>
			<div class="div-grey-box">
				<div
					class="row"
					style="display: flex; cursor: pointer;"
					data-bs-toggle="collapse"
					data-bs-target="#pop-info"
					aria-expanded="false"
					aria-controls="pop-info"
				>
					<div class="blocktitle" style="margin: 0; width: 100%">
						Births <span style="color: gray; font-size: 14pt;"
							>{@html " &#x24D8; "}
						</span>
					</div>
				</div>
				<div class="collapse" id="pop-info">
					<div class="card card-body">
						words.....
					</div>
				</div>
				<span class="text-big" style="font-size: 2.8em;"
					>25,000</span
				><br />

			</div>
			<div class="div-grey-box">
				<div
					class="row"
					style="display: flex; cursor: pointer;"
					data-bs-toggle="collapse"
					data-bs-target="#pop-info2"
					aria-expanded="false"
					aria-controls="pop-info2"
				>
					<div class="blocktitle" style="margin: 0; width: 100%">
						Deaths <span style="color: gray; font-size: 14pt;"
							>{@html " &#x24D8; "}
						</span>
					</div>
				</div>
				<div class="collapse" id="pop-info2">
					<div class="card card-body">
						words....
						
					</div>
				</div>
				<span class="text-big" style="font-size: 2.8em;"
					>15,000</span
				><br />

			</div>
		</div>

		<div class="grid mt" bind:clientWidth={w}>
			<div style="grid-column: span {cols};">
				<h3>Explore <span style="color: #93328E">{place.name} </span></h3>
			</div>
			<div id="map" style="padding-right: 45px; grid-column: span {cols == 2 ? 2 : cols && cols > 2 ? cols - 1 : 1};  ">
				<Map bind:map location={{bounds: place.bounds}} options={{fitBoundsOptions: {padding: 20}}} style={mapStyle}>
					{#each ['ward', 'dea'] as key}
					<MapSource {...mapSources[key]}>
						<MapLayer
							{...mapLayers[key]}
							id="{key}-fill"
							type="fill"
							isChild={isChild[key]}
							click={true}
							selected={active.selected}
							on:select={mapSelect}
							highlight={true}
							highlighted={active.highlighted}
							hover={true}
							hovered={active.hovered}
							layout={{visibility: active.type == key || active.childType == key ? 'visible' : 'none'}}
							paint={active.type == key ? mapPaint['fill-self'] : active.childType == key ? mapPaint['fill-child'] : mapPaint.fill}/>
						<MapLayer
							{...mapLayers[key]}
							id="{key}-bounds"
							type="line"
							selected={active.selected}
							highlight={true}
							highlighted={active.highlighted}
							layout={{visibility: active.type == key || active.childType == key ? 'visible' : 'none'}}
							paint={active.type == key ? mapPaint['line-active'] : active.childType == key ? mapPaint['line-child'] : mapPaint.line}/>
						<MapLayer
							{...mapLayers[key]}
							id="{key}-self"
							type="line"
							selected={active.selected}
							layout={{visibility: active.type == key ? 'visible' : 'none'}}
							paint={active.type == key ? mapPaint['line-self'] : mapPaint.line}/>
					</MapSource>
					{/each}
					<MapSource {...mapSources.lgd}>
					{#each ['lgd'] as key}
						<MapLayer
							{...mapLayers[key]}
							id={key + "-fill"}
							type="fill"
							isChild={isChild[key]}
							click={true}
							selected={active.selected}
							on:select={mapSelect}
							highlight={true}
							highlighted={active.highlighted}
							hover={true}
							hovered={active.hovered}
							layout={{visibility: active.type == key || active.childType == key ? 'visible' : 'none'}}
							paint={active.type == key ? mapPaint['fill-self'] : active.childType == key ? mapPaint['fill-child'] : mapPaint.fill}/>
						<MapLayer
							{...mapLayers[key]}
							id={key + "-bounds"}
							type="line"
							selected={active.selected}
							highlight={true}
							highlighted={active.highlighted}
							layout={{visibility: active.type == key || active.childType == key ? 'visible' : 'none'}}
							paint={active.type == key ? mapPaint['line-active'] : active.childType == key ? mapPaint['line-child'] : mapPaint.line}/>
						<MapLayer
							{...mapLayers[key]}
							id={key + "-self"}
							type="line"
							selected={active.selected}
							layout={{visibility: active.type == key ? 'visible' : 'none'}}
							paint={active.type == key ? mapPaint['line-self'] : mapPaint.line}/>
						{/each}
					</MapSource>
				</Map>
			</div>
			<div>
				<span class="text-bold">Parents of {place.name}</span><br/>
				<span class="text-small">
				{#if place.parents[0]}
				{#each [...place.parents].reverse() as parent, i}
				<span style="display: block; margin-left: {i > 0 ? (i - 1) * 15 : 0}px">{@html i > 0 ? '↳ ' : ''}<a href="{base}/{parent.code}" sveltekit:noscroll>{parent.name}</a></span>
				{/each}
				{:else}
				<span class="muted">No parents for {place.name}</span>
				{/if}
				</span>
			</div>
			<div>
				<span class="text-bold">{place.children[0] ? types[place.children[0].type].pl : 'Areas'} within {place.name}</span><br/>
				<span class="text-small">
				{#if place.children[0]}
				{#each place.children as child, i}
				<a href="{base}/{child.code}" sveltekit:noscroll>{child.name}</a>{ i < place.children.length - 1 ? ', ' : ''}
				{/each}
				{:else}
				<span class="muted">No areas below {place.name}</span>
				{/if}
				</span>
			</div>
		</div>



 		<div class="text-bold" style="font-size: 0.85em;">
			<br />
			<div class="text-bold" style="font-size: 1.2em;">
				Select vital statistics topics:
			</div>

			{#if demog == true}
				<button
					class="btn"
					class:btn-active={demog}
					on:click={() => (demog = false)}
					>Demography <sup>x</sup> </button>
			{:else}
				<button
					class="btn"
					class:btn-active={demog}
					on:click={() => (demog = true)}>Demography </button>
			{/if}

			<br />
			<br />

		</div> 


	
		{#if demog}
			<div style="grid-column: span {cols};">
				<h2>
					Demography <span class="title-inset muted"
						>{place.name} - Census 2021</span
					>
				</h2>
			</div>
			<div class="grid mt" bind:clientWidth={w}>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#broadagebands-info"
						aria-expanded="false"
						aria-controls="broadagebands-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Broad age bands (years) <span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="broadagebands-info">
						<div class="card card-body">
							words....
						</div>
					</div>

					<div
						class="chart"
						style="height: 100px; padding-bottom: 5px"
					>
						<ColChart
							data={place && makeData(["age", "perc", "2021"])}
							zKey={noCompare
								? null
								: overtime
								? "prev"
								: !overtime && place.type != "ew"
								? "ew"
								: null}
						/>
					</div>
				</div>
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#broadagebands-info"
						aria-expanded="false"
						aria-controls="broadagebands-info"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Broad age bands (years) <span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="broadagebands-info">
						<div class="card card-body">
							words....
						</div>
					</div>
					<StackedBarChart
						data={place && makeData(["age", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>	
				<div class="div-grey-box">
					<div
						class="row"
						style="display: flex; cursor: pointer;"
						data-bs-toggle="collapse"
						data-bs-target="#broadagebands-info1"
						aria-expanded="false"
						aria-controls="broadagebands-info1"
					>
						<div class="blocktitle" style="margin: 0; width: 100%">
							Broad age bands (years) <span
								style="color: gray; font-size: 14pt;"
								>{@html " &#x24D8; "}</span
							>
						</div>
					</div>
					<div class="collapse" id="broadagebands-info1">
						<div class="card card-body">
							words....
						</div>
					</div>
					<StackedBarChart
						data={place && makeData(["age", "perc", "2021"])}
						zKey={noCompare
							? null
							: overtime
							? "prev"
							: !overtime && place.type != "ew"
							? "ew"
							: null}
						label={chartLabel}
					/>
				</div>	
</div>
		{/if}

	

		
	{/if}
</Section>

<style>
	a {
		color: rgb(0, 60, 87);
	}
	h3 {
		margin-top: 12px;
	}
	h2 {
		margin-top: 20px;
		page-break-before: always;
	}

	.div-grey-box {
		line-height: 1.78;
		overflow: hidden;
		box-shadow: 0 2px #4140424d;
		background-color: #f5f5f6;
		padding: 16px 16px;
	}
	.btn {
		padding: 2px 4px;
		margin: 0.2;
		border: 2px solid #00205b;
		cursor: pointer;
		color: #00205b;
		background-color: lightgrey;
	}
	.btn-active {
		color: white;
		background-color: #00205b;
	}
	.increase {
		color: darkgreen;
	}
	.increase::before {
		content: "▲";
		color: darkgreen;
	}
	.decrease {
		color: darkred;
	}
	.decrease::before {
		content: "▼";
		color: darkred;
	}
	.nochange {
		font-size: 0.85em;
		color: grey;
	}
	.line {
		background-color: #cedc20;
		width: 25px;
		height: 4px;
		display: inline-block;
		margin-bottom: 3px;
	}
	.title {
		display: inline-block;
		margin-top: -3px;
	}
	.text-right {
		text-align: right;
	}
	.float-right {
		float: right;
	}
	.inline {
		display: inline-block;
	}
	.condensed {
		line-height: 1.1em;
	}
	.mt {
		margin-top: 20px;
	}
	.mts {
		margin-top: 10px;
	}
	.mtl {
		margin-top: 55px;
	}
	.mbs {
		margin-bottom: 10px;
	}
	.grid {
		display: grid;
		width: 100%;
		grid-gap: 10px;
		grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
		justify-content: stretch;
		page-break-inside: avoid;
	}
	.title-inset {
		font-weight: normal;
		font-size: 13.6px;
	}
	#grid {
		grid-gap: 20px !important;
	}
	.chart {
		position: relative;
		width: 100%;
	}
	#map {
		grid-row: span 2;
		min-height: 400px;
	}

	.tooltip {
		position: relative;
		display: inline-block;
	}

	.tooltip .tooltiptext {
		visibility: hidden;
		width: 120px;
		background-color: #666666;
		color: #fff;
		text-align: center;
		border-radius: 6px;
		padding: 5px 0;
		bottom: 100%;
		right: 100%;
		font-size: 12pt;

		/* Position the tooltip */
		position: absolute;
		z-index: 1;
	}

	.tooltip:hover .tooltiptext {
		visibility: visible;
	}

	.collapse:not(.show) {
		display: none;
	}
	.collapsing {
		height: 0;
		overflow: hidden;
		transition: height 0.35s ease;
	}

	.show {
		display: block !important;
	}

	.card {
		--bs-card-spacer-y: 0.1rem;
		--bs-card-spacer-x: 0.5rem;
		--bs-card-title-spacer-y: 0.5rem;
		--bs-card-border-width: 1px;
		--bs-card-border-color: var(--bs-border-color-translucent);
		--bs-card-border-radius: 0.375rem;
		--bs-card-box-shadow: ;
		--bs-card-inner-border-radius: calc(0.375rem - 1px);
		--bs-card-cap-padding-y: 0.5rem;
		--bs-card-cap-padding-x: 1rem;
		--bs-card-cap-bg: rgba(0, 0, 0, 0.03);
		--bs-card-cap-color: ;
		--bs-card-height: ;
		--bs-card-color: ;
		--bs-card-bg: #fff;
		--bs-card-img-overlay-padding: 1rem;
		--bs-card-group-margin: 0.75rem;
		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		height: var(--bs-card-height);
		word-wrap: break-word;
		background-color: var(--bs-card-bg);
		background-clip: border-box;
		border: var(--bs-card-border-width) solid var(--bs-card-border-color);
		border-radius: var(--bs-card-border-radius);
	}

	.card-body {
		flex: 1 1 auto;
		padding: var(--bs-card-spacer-y) var(--bs-card-spacer-x);
		color: var(--bs-card-color);
		font-size: 10pt;
		margin-bottom: 5px;
	}


	.blockinfoicon {
		font-size: 14pt;
	}

	@media print {
		.highlited {
			color: red !important;
			-webkit-print-color-adjust: exact;
		}
	}

	/* manual override for black svg icons that filters them to a specified colour */
	.filter-navy {
		filter: invert(12%) sepia(78%) saturate(1934%) hue-rotate(204deg)
			brightness(91%) contrast(110%);
	}
</style>
