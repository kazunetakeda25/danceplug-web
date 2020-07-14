<template>
  <div
    v-if="sourceVideo"
    class="embed-responsive embed-responsive-16by9"
    @mouseenter="play"
    @mouseleave="stop"
  >
    <video
      ref="classPreview"
      :data-muted="isMuted"
      :disabled="isPlaying"
      :poster="posterImage"
      preload="metadata"
      playsinline
      muted
    >
      <source :src="sourceVideo" type="video/mp4" />
    </video>
    <span v-if="isPlaying" @click="toggleMute">
      <Icon
        class="volume"
        :class="{ 'volume-on': !isMuted }"
        name="icon-volume-off"
      />
    </span>
  </div>
  <div v-else class="class-image">
    <div v-html="image" />
  </div>
</template>

<script>
export default {
  name: 'MediaPreview',
  props: {
    image: {
      type: String,
      required: false,
    },
    sourceVideo: {
      type: String,
      required: false,
    },
    posterImage: {
      type: String,
      required: false,
    },
    link: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      isPlaying: false,
      isMuted: true,
    };
  },
  methods: {
    play() {
      this.$refs.classPreview.load();
      const playPromise = this.$refs.classPreview.play();
      if (playPromise !== undefined) {
        playPromise
            .then((_) => {
              this.isPlaying = true;
            })
            .catch((error) => {
              this.stop();
            });
      }
    },
    stop() {
      this.$refs.classPreview.load();
      this.$refs.classPreview.currentTime = 0;
      this.isPlaying = false;
    },
    toggleMute() {
      const vid = this.$refs.classPreview;
      this.isMuted = !this.isMuted;
      vid.muted = !vid.muted;
    },
  },
};
</script>
