<template>
  <div></div>
</template>

<script>
export default {
  middleware({ store, redirect }) {
    // If the user is not authenticated
    return redirect('/admin')
  },
  name: 'Index',
}
</script>
