var pointCloudData = ``;

//Read 2D pointcloud from file
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = function (event) {
      pointCloudData = event.target.result;
      updatePointCloud(slider.value / 100, pointCloudData);
    };

    reader.readAsText(file);
  });

//=== Range slider code credit to w3schools dot com: https://www.w3schools.com/howto/howto_js_rangeslider.asp
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function () {
  output.innerHTML = this.value;
  updatePointCloud(this.value / 100, pointCloudData);
  var toggleButton = document.getElementById("toggleButton");

  toggleButton.checked = false;
};

// 2D mapping and line segment detection algorithm function
function updatePointCloud(errMargin, pointCloudData) {
  const SCALE = 10;
  var arrX = [];
  var arrY = [];

  var tempArray = [];
  var arrayOfArrays = [];

  var points = pointCloudData
    .split("\n")
    .map((line) => line.trim().split(/\s+/));

  var canvas = document.getElementById("pointCloudCanvas");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "grey";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "black";

  points.forEach((point, index) => {

    // grab angle and distance
    var angle = parseFloat(point[0]);
    var distance = parseFloat(point[1]);

    //Convert angle to radians and calculate x, y position.
    var x =
      Math.cos(((angle - 90) * Math.PI) / 180) * (distance / SCALE) +
      (canvas.width - 200) / 2;
    var y =
      Math.sin(((angle - 90) * Math.PI) / 180) * (distance / SCALE) +
      (canvas.height + 200) / 2;

    arrX.push(x);
    arrY.push(y);

    // checking for clusters of points which are close to each other
    if (index > 1) {
      var prevX = arrX[index - 1];
      var prevY = arrY[index - 1];
      var thresholdX = prevX * errMargin;
      var thresholdY = prevY * errMargin;
      if (
        (x < prevX + thresholdX) &&
        (x > prevX - thresholdX) &&
        (y < prevY + thresholdY) &&
        (y > prevY - thresholdY)
      ) {
        tempArray.push([x, y]);
        ctx.fillStyle = "black";

        ctx.fillRect(x, y, 2, 2);
      } else {
        arrayOfArrays.push(tempArray);
        tempArray = [];
        ctx.fillStyle = "blue";
        ctx.fillRect(x, y, 2, 2);
      }
    }
  });

  // If there are remaining points in the temporary array, push it to array of arrays
  if (tempArray.length > 0) {
    arrayOfArrays.push(tempArray);
  }

  // function to remove path lines from canvas
  function removePathLines() {
    const canvas = document.getElementById("pointCloudCanvas");
    const ctx = canvas.getContext("2d");

    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw the background
    ctx.fillStyle = "grey";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redraw only the points
    ctx.fillStyle = "black";
    for (let i = 0; i < arrX.length; i++) {
      ctx.fillRect(arrX[i], arrY[i], 2, 2);
    }
  }

  var toggleButton = document.getElementById("toggleButton");
  toggleButton.addEventListener("change", function () {
    test();
  });

  function test() {
    if (toggleButton.checked) {
      removePathLines();

      arrayOfArrays = arrayOfArrays.filter((array) => array.length > 0);
      ctx.strokeStyle = "red";
      // iterate over each sub-array in arrayOfArrays
      arrayOfArrays.forEach((subArray) => {
        if (subArray.length > 0) {
          ctx.beginPath();

          // move to the first point in the sub-array
          ctx.moveTo(subArray[0][0], subArray[0][1]);

          // draw lines to each point in the sub-array
          for (let i = 1; i < subArray.length; i++) {
            ctx.lineTo(subArray[i][0], subArray[i][1]);
          }

          ctx.stroke();
        }
      });
    } else {
      removePathLines();
    }
  }
}
updatePointCloud(slider.value / 100, pointCloudData);
