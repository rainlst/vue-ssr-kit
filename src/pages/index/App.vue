<template lang="jade">
  main.main-ctnr
    div.t-center
      h1 Greeting from {{pageName}}!
      p {{name}}
</template>

<style lang="stylus" scoped>
</style>

<script>
  export default {
    data () {
      return {
        pageName: 'Index',
        name: ''
      }
    },

    methods: {
      changeName (name) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.name = name
            resolve()
          }, 1000)
        })
      }
    },

    async mounted () {
      await this.changeName('ES2016')
      await this.changeName('is')
      await this.changeName('Awesome!')
    }
  }
</script>
