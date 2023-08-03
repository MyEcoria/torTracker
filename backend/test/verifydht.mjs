import peersDHT from '../modules/peers.mjs';

async function test() {
    await peersDHT(12, "81F8C167E2919BBF78122573C375F8D456277183", false);
}

test();