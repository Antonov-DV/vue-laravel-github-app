<template>
    <div class="col-md-3 centeralign">
        <b-alert show> {{ selectedRepo }} Selected</b-alert>
    </div>
</template>

<script>
    export default {
        name: 'Display',
        props: {
            selectedRepo: String
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }
</style>
