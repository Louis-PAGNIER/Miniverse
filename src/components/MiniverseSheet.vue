<script setup>
const props = defineProps({
  miniverse: { type: Object, required: true },
})
</script>

<template>
  <div class="presentation">
    <h1 class="title">{{ miniverse.name }}</h1>
    <div class="navigator"><span class="path">Home</span> ⟩ <span class="path">Settings</span></div>
    <div class="details">

      <div class="tile">
        <div class="icon"><img src="@/assets/images/steve.png" alt="Player Icon"></div>
        <div class="column">
          <div class="value">1.21.2</div>
          <div class="label">MC Version</div>
        </div>
      </div>

      <div class="tile">
        <div class="icon"><img src="@/assets/images/steve.png" alt="Player Icon"></div>
        <div class="column">
          <div class="value">5/20</div>
          <div class="label">Players</div>
        </div>
      </div>

      <div class="tile">
        <div class="icon"><img src="@/assets/images/steve.png" alt="Player Icon"></div>
        <div class="column">
          <div class="value">5/20</div>
          <div class="label">Players</div>
        </div>
      </div>

      <div class="tile">
        <div class="icon"><img src="@/assets/images/steve.png" alt="Player Icon"></div>
        <div class="column">
          <div class="value">5/20</div>
          <div class="label">Players</div>
        </div>
      </div>

      <div class="tile">
        <div class="icon"><img src="@/assets/images/steve.png" alt="Player Icon"></div>
        <div class="column">
          <div class="value">5/20</div>
          <div class="label">Players</div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.presentation {
  width: calc(100% - 40px);
  max-width: 1400px;
  padding: 10px 20px;
  background: #2c2c2c;
  border-radius: 10px;
  margin: 0 auto;
  min-height: calc(100% - 40px);
  border: #5e5e5e 1px solid;
  color: white;
  font-size: 1.2em;

  & > .title {
    font-size: 2em;
    margin: 0;
    padding: 10px 0 0 0;
    font-weight: 600;
  }
}

.details {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 16px 0;
  gap: 20px;

  & > .tile {
    background: #3c3c3c;
    height: 6.5em;
    display: flex;
    gap: 20px;
    padding: 23px;
    border-radius: 16px;
    align-items: center;
    flex: 1;
    min-width: 16em;
    max-width: 18em;
    cursor: pointer;
    transition: background 0.2s;
    overflow: hidden;

    &:hover {
      background: #484848;
    }

    & > .icon, & > .icon > img {
      width: 4em;
      height: 4em;
      image-rendering: pixelated;
      border-radius: 8px;
      user-select: none;
      -webkit-user-drag: none;
    }

    & .column {
      display: flex;
      flex-direction: column;
      justify-content: left;
      cursor: auto;
      white-space: nowrap;
    }

    & .value {
      font-size: 1.5em;
      font-weight: bold;
      cursor: auto;
    }
  }
}

.navigator {
  color: #a0a0a0;
  font-weight: 600;
  cursor: default;

  & > .path {
    cursor: pointer;
    transition: color 0.2s;
    &:hover {
      color: white;
    }
  }
}
</style>