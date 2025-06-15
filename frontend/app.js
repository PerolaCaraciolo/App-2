async function registrarHumor() {
  const humor = document.getElementById('humor').value;
  const comentario = document.getElementById('comentario').value;
  const fileInput = document.getElementById('foto');
  let imagemBase64 = '';

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onloadend = async function () {
      imagemBase64 = reader.result;
      await enviarRegistro(humor, comentario, imagemBase64);
    };
    reader.readAsDataURL(file);
  } else {
    await enviarRegistro(humor, comentario, '');
  }
}

async function enviarRegistro(humor, comentario, imagemBase64) {
  if (!navigator.geolocation) {
    alert('Geolocalização não suportada!');
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;

    const res = await fetch('/api/humor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ humor, comentario, latitude, longitude, imagemBase64 }),
    });

    const data = await res.json();
    document.getElementById('mensagem').innerText = data.message;
    carregarHistorico();
  }, (err) => {
    alert('Erro ao obter localização');
  });
}

async function carregarHistorico() {
  const res = await fetch('/api/humor');
  const registros = await res.json();
  const historicoDiv = document.getElementById('historico');
  historicoDiv.innerHTML = '';

  registros.reverse().forEach(reg => {
    const card = document.createElement('div');
    card.className = 'registro';

    const data = new Date(reg.timestamp).toLocaleString();

    card.innerHTML = `
      <p><strong>Humor:</strong> ${reg.humor}</p>
      <p><strong>Comentário:</strong> ${reg.comentario || '(sem comentário)'}</p>
      <p><strong>Data:</strong> ${data}</p>
      <p><strong>Localização:</strong> ${reg.latitude.toFixed(4)}, ${reg.longitude.toFixed(4)}</p>
      ${reg.imagemBase64 ? `<img src="${reg.imagemBase64}" alt="Foto" />` : ''}
      <hr/>
    `;
    historicoDiv.appendChild(card);
  });
}

window.onload = carregarHistorico;