// server.js
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('✅ WebSocket server started on ws://localhost:8080');

wss.on('connection', ws => {
  console.log('✅ Client connected');

  // --- 예제: 클라이언트가 연결되면 테스트 프롬프트를 보냅니다 ---
  const prompt = "Explain the difference between a WebSocket and a regular HTTP connection in simple terms.";
  console.log(`\n▶️ Sending prompt to client: "${prompt}"`);
  ws.send(prompt);
  // ----------------------------------------------------------------

  let fullResponse = '';

  ws.on('message', message => {
    const received = message.toString();

    // 스트림 종료 메시지인지 확인합니다.
    if (received === '__END_OF_STREAM__') {
      console.log('\n✅ Stream finished.');
      console.log('📦 Full response received:\n---');
      console.log(fullResponse.trim());
      console.log('---\n');
      fullResponse = ''; // 다음 프롬프트를 위해 초기화

      // 큐(Queue)에 다른 작업이 있다면 여기서 다음 프롬프트를 보낼 수 있습니다.
      // 예: ws.send("Tell me another story.");

    } else if (received.startsWith('__ERROR__:')) {
      const errorMsg = received.substring('__ERROR__:'.length);
      console.error(`\n❌ An error occurred: ${errorMsg}`);
      fullResponse = ''; // 에러 발생 시 초기화

    } else {
      // 스트리밍 응답의 일부(chunk)입니다.
      process.stdout.write(received); // 줄바꿈 없이 출력
      fullResponse += received;
    }
  });

  ws.on('close', () => {
    console.log('\n❌ Client disconnected');
  });

  ws.on('error', error => {
    console.error('WebSocket error:', error);
  });
});