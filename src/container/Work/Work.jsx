<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Crazy Animation with GSAP</title>
<style>
  body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
    font-family: Arial, sans-serif;
  }
  .container {
    text-align: center;
  }
  .animated-text {
    font-size: 3em;
    color: #333;
    display: inline-block;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }
</style>
</head>
<body>

<div class="container">
  <div class="animated-text" id="bounceText">Crazy Animation!</div>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js"></script>
<script>
  gsap.to("#bounceText", {
    duration: 1,
    y: -50,
    ease: "bounce.out",
    repeat: -1,
    yoyo: true
  });
</script>

</body>
</html>
