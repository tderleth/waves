// Create an array of SVG path strings, each defining a line starting from a specific point on the SVG canvas
const PATH_ARRAY = new Array(255).fill("").map((_element, index) => `M ${index},255 l 0,-0`);

const audioOn = (audioStream) => {
  // Create an AudioContext to manage audio operations
  const audioContext = new AudioContext();

  // Create an AnalyserNode to extract frequency data
  const analyser = audioContext.createAnalyser();

  // Create a source node from the audio stream
  const source = audioContext.createMediaStreamSource(audioStream);

  // Connect the source to the analyser
  source.connect(analyser);

  // Set the FFT (Fast Fourier Transform) size for frequency analysis
  analyser.fftSize = 1024;

  // Create a Uint8Array to store frequency data
  const frequencyArray = new Uint8Array(analyser.frequencyBinCount);

  // Function to continuously update the visual representation of audio frequencies
  const draw = () => {
    // Find the container in the HTML document
    const container = document.querySelector("#mask");

    // Clear the container for new visualizations
    container.replaceChildren();

    // Request animation frame for smooth updates
    requestAnimationFrame(draw);

    // Get frequency data into the frequencyArray
    analyser.getByteFrequencyData(frequencyArray);

    // Map the PATH_ARRAY with frequency data to create SVG path elements
    PATH_ARRAY.map((path, index) => {
      // Calculate new length based on frequency data
      const newLength = Math.floor(frequencyArray[index]) - (Math.floor(frequencyArray[index]) % 5);

      // Create an SVG path element
      const element = document.createElementNS("http://www.w3.org/2000/svg", "path");

      // Set attributes for the SVG path
      element.setAttribute("d", `M ${index},255 l 0,-${newLength / 5}`);

      // Append the SVG path to the container
      container.appendChild(element);
    });
  };

  // Start the continuous visualization
  draw();
};

// Function to handle errors if audio access fails
const audioOff = (error) => {
  alert(error);
};

// Main function to initiate audio stream access
function main() {
  // Try to access the user's audio input
  navigator.getUserMedia({ audio: true, video: false }, audioOn, audioOff);
}

// Call the main function to begin the audio stream access
main();
