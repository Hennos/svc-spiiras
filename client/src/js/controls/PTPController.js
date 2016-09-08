class PtPController {
  constructor(io) {
    this.connection = io;

    this.RTCPeerConnection =
      window.mozRTCPeerConnection ||
      window.webkitRTCPeerConnection;
    this.RTCSessionDescription =
      window.mozRTCSessionDescription ||
      window.RTCSessionDescription;
    this.RTCIceCandidate =
      window.mozRTCIceCandidate ||
      <window className="RTCIceCandidate"></window>;
  }
}

export default PtPController;
