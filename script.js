kaboom({
  global: true,
  //fullscreen: true,
  debug: true,
})

loadRoot("/assets/")
loadSprite("ship", "spaceship.png")
loadSprite("bg", "Nebula_Oversized.png")
loadSprite("pipe", "pipe.png")

const JUMP_FORCE = 300
const PIPE_OPEN = 120
const PIPE_SPEED = 160

scene("main", () => {

  layers([
    "game",
    "ui",
  ], "game");


  add([
    sprite("bg"),
    origin("topleft"),
  ])

  const ship = add([
    sprite("ship"),
    area(vec2(50), vec2(47)),
    pos(80, 80),
    rotate(Math.PI * 1.5),
    scale(0.7),
    body()
  ])


  loop(2, () => {

    const pipePos = rand(0, height() - PIPE_OPEN);

    add([
      sprite("pipe"),
      origin("bot"),
      scale(2.5),
      pos(width(), pipePos),
      "pipe"
    ])

    add([
      sprite("pipe"),
      origin("top"),
      pos(width(), pipePos + PIPE_OPEN),
      scale(2.5),
      area(vec2(28), vec2(182)),
      "pipe",
      { passed: false, },
    ])

  })

  action("pipe", (pipe) => {
    pipe.move(-PIPE_SPEED, 0)

    if (pipe.pos.x + pipe.width <= ship.pos.x && pipe.passed == false) {
      score.value++;
      score.text = score.value;
      pipe.passed = true;
    }

    if (pipe.pos.x + pipe.width < 0)
      destroy(pipe);
  })

  keyPress("space", () => {
    ship.jump(JUMP_FORCE)
  })

  ship.action(() => {
    if (ship.pos.y >= height())
      go("gameover", score.value)
  })

  ship.collides("pipe", () => {
    go("gameover", score.value)
  })

  const score = add([
    pos(12, 12),
    text("0", 32),
    { value: 0, },
    layer("ui"),
  ])

})


scene("gameover", (score) => {

  add([
    sprite("bg"),
    origin("topleft"),
  ])

  add([
    rect(620, 130),
    origin("center"),
    pos(width() / 2, height() / 2),
    color(1, 0, 1)
  ])
  add([
    text(`Score: ${score}`, 27),
    origin("center"),
    pos(width() / 2, height() / 2 - 30)
  ])

  add([
    text("Press enter to try again", 24),
    origin("center"),
    pos(width() / 2, height() / 2 + 30)
  ])

  keyPress("enter", () => {
    go("main")
  })
})

start("main")