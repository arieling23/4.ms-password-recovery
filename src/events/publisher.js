const amqp = require('amqplib');

let channel;

const connectRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log('📡 Conectado a RabbitMQ');
  } catch (err) {
    console.error('❌ Error conectando a RabbitMQ:', err);
  }
};

// Publicar evento
const publish = async (event, data) => {
  if (!channel) {
    await connectRabbitMQ();
  }

  const exchange = 'events'; 
  const msg = JSON.stringify({ event, data, timestamp: new Date() });

  await channel.assertExchange(exchange, 'fanout', { durable: false });
  channel.publish(exchange, '', Buffer.from(msg));
  console.log(`📤 Evento publicado: ${event}`);
};

module.exports = {
  publish
};
