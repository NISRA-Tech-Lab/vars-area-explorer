<script>
	import { assets } from "$app/paths";
	  import { getContext } from 'svelte';
  
	  export let theme = getContext('theme');
	  export let filled = true;
	  export let center = false;
</script>
  
	<nav style="border-bottom-color: {theme['muted']}; {filled ? 'background-color: ' +  theme['background'] + ';' : ''}">
		<div class="col-wide left" style="flex-direction: row; -ms-flex-direction: row;" class:center>
			<a href="https://www.nisra.gov.uk/">
				<picture>
					{#if theme.name == 'dark'}
					<img style="width:130px;" src="{assets}/img/nisra-only-white.png" alt="Northern Ireland Statistics and Research Agency">
					{:else if filled == true}
					<img style="width:130px;" src="{assets}/img/nisra-only-colour.png" alt="Northern Ireland Statistics and Research Agency">
					{:else}
					<img style="width:130px;" src="{assets}/img/nisra-only-colour.png" alt="Northern Ireland Statistics and Research Agency">
					{/if}
				</picture>
			</a>
			<a href="https://www.nisra.gov.uk/statistics/census">
				<picture style="float: right; top: 0px;">
					{#if theme.name == 'dark'}
					<img src="{assets}/img/vars-logo-white.png" alt="NISRA vital statistics logo">
					{:else if filled == true}
					<img src="{assets}/img/vars-logo-navy.png" alt="NISRA vital statistics logo">
					{:else}
					<img src="{assets}/img/vars-logo-navy.png" alt="NISRA vital statistics logo">
					{/if}
				</picture>
			</a>	

		</div>
	</nav>
  
  <style>
	  nav {
		  -webkit-box-sizing: border-box;
		  box-sizing: border-box;
		  position: relative;
		  height: 65px;
		  margin-bottom: -46px;
		  border-bottom: 1px solid #777;
		  z-index: 1;
	  }
	  picture {
		  position: relative;
		  top: 12px;
		  padding: 10px 12px;
	  }
	  img {
		  width: 110px;
	  }
	  a img:hover {
		  cursor: pointer;
	  }
  </style>