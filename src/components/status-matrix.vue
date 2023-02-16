<template>
<div>
  <div class="d-flex justify-content-center" v-for="i in Array(this.matrixSize).keys()" :key="i">
    <button disabled :class="this.currMatrix[i * this.matrixSize + j] === this.toMatrix[i * this.matrixSize + j] ? 'fixed-size-child m-1 btn btn-success' : 'fixed-size-child m-1 btn btn-dark'" v-for="j in Array(this.matrixSize).keys()" :key="i * this.matrixSize + j">
      <small class="text-nowrap">{{ this.currMatrix[i * this.matrixSize + j] }}</small>
    </button>
  </div>
</div>
</template>

<script>
export default {
  name: "status-matrix",
  props: {
    matrixSize: Number,
    currMatrix: Array,
    toMatrix: Array
  },
  data: function () {
    return {

    }
  }
}
</script>

<style scoped>
.fixed-size-child {
  width: 40px;
  height: 40px;
}
</style>