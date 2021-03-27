const constraints = (window.constraints = {
  audio: false,
  video: true,
})

function handleSuccess(stream) {
  const video = document.querySelector('video')
  const videoTracks = stream.getVideoTracks()
  console.log('Got stream with constraints:', constraints) //constraints on the videocam
  console.log(`Using video device: ${videoTracks[0].label}`) //name of the video cam
  window.stream = stream
  video.srcObject = stream
}

function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    const v = constraints.video
    errorMsg(
      `The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`
    )
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg(
      'Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.'
    )
  }
  errorMsg(`getUserMedia error: ${error.name}`, error)
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg')
  errorElement.innerHTML += `<p>${msg}</p>`
  if (typeof error !== 'undefined') {
    console.error(error)
  }
}

async function init(e) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    handleSuccess(stream)
    e.target.disabled = true
    document.getElementById('closeVideo').disabled = false
  } catch (err) {
    handleError(err)
  }
}

function close(e) {
  const video = document.querySelector('video')
  video.srcObject = null
  e.target.disabled = true
  document.getElementById('showVideo').disabled = false
}

//setting up canvas

const button = document.getElementById('snapshot')
button.onclick = function () {
  const videocanvas = document.getElementById('videocanvas')
  videocanvas.appendChild(document.createElement('canvas'))
  const canvas = (window.canvas = document.querySelector('canvas'))
  const video = document.querySelector('video')
  if (video.srcObject == null) {
    alert('Video is Not selected')
    return 0
  }
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
  document.getElementById('removesnapshot').disabled = false
}
function removesnapshot(e) {
  e.target.disabled = true
  const canvas = (window.canvas = document.querySelector('canvas'))
  canvas.remove()
  document.getElementById('snapshot').disabled = false
}

document.getElementById('showVideo').addEventListener('click', (e) => init(e))

document.getElementById('closeVideo').addEventListener('click', (e) => close(e))
document
  .getElementById('removesnapshot')
  .addEventListener('click', (e) => removesnapshot(e))
