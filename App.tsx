import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import './style.css';
import AgoraRTM from 'agora-rtm-sdk';

export default function App() {
  let localVideo = useRef();
  let remoteVideo = useRef();
  let APP_ID = '6765a96d515f4b5d8eebe92e6d722cd2';
  let token = null;
  let uid = String(Math.floor(Math.random() * 10000));
  let localStream;

  let client;
  let channel;

  let peerConnection;
  let remoteStream;
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun3.l.google.com:19302',
          'stun:stun4.l.google.com:19302',
        ],
      },
    ],
  };

  let init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    localVideo.current.srcObject = localStream;
    localVideo.current.play();

    client = await AgoraRTM.createInstance(APP_ID);
    client.login({ uid });
    console.dir({ client, uid });
  };

  let handleUserJoined = async (MemberId) => {
    console.log('A new user joined CHannel:', MemberId);
  };
  const generateOffer = async () => {
    peerConnection = new RTCPeerConnection(servers);
    remoteStream = new MediaStream();
    remoteVideo.current.srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTracks(track);
      });
    };

    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        console.log(event.candidate);
      }
    };

    let offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    console.log(offer);
  };

  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <div style={{ display: 'flex' }}>
        <video autoPlay ref={localVideo} />
        <video autoPlay ref={remoteVideo} />
      </div>

      <button onClick={(e) => init()}> start video</button>
      <button onClick={() => generateOffer()}>generate Offer</button>
      <p>Start editing to see some magic happen :)</p>
    </div>
  );
}
