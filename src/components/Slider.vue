<template>
    <div>
        <input 
            type="range" 
            :min="min" 
            :max="max" 
            :value="value"
            class="slider"
        >
    </div>
</template>

<script>
export default {
    props: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
    },
	methods: {
		toggled() {
			this.$emit("toggle");
		}
	}
};
</script>

<style scoped>
.slider {
  -webkit-appearance: none;
  width: 8rem;
  background: #d3d3d3;
  border-radius: 1rem;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  background: #2196f3;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 1rem;
  height: 1rem;
  border-radius: 1rem;
  background: #2196f3;
  cursor: pointer;
}
</style>