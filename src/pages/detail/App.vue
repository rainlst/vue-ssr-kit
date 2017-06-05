<template lang="jade">
  div#index-app
    div.t-center
      h1 Greeting from {{pageName}}!
      p {{test}}
</template>

<style lang="stylus" scoped>
  body
    background-color: gray
</style>

<script>
export default {
  data () {
    return {
      pageName: 'Detail',
      name: 'stone'
    }
  },
  computed:{
    test(){
       return this.$store.state.test
    }
  }
}
</script>
