const sphere = document.getElementById('sphere');
const numLayers = 18;
const numSegments = 36;
const radius = 200;
const particles = [];
let isSeparated = false;

// Fonction pour générer une couleur aléatoire (rouge ou vert)
function getRandomColor() {
  return Math.random() > 0.5 ? 'red' : 'green';
}

// Création des particules
for (let i = 0; i <= numLayers; i++) {
  const latitude = (i / numLayers) * Math.PI - Math.PI / 2;

  for (let j = 0; j < numSegments; j++) {
    const segment = document.createElement('div');
    segment.classList.add('layer');

    const color = getRandomColor();
    segment.style.backgroundColor = color;

    const longitude = (j / numSegments) * 2 * Math.PI;

    const x = radius * Math.cos(latitude) * Math.cos(longitude);
    const y = radius * Math.sin(latitude);
    const z = radius * Math.cos(latitude) * Math.sin(longitude);

    segment.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    sphere.appendChild(segment);

    particles.push({
      element: segment,
      latitude,
      longitude,
      originalX: x,
      originalY: y,
      originalZ: z,
      color: color,
      offsetX: Math.random() * 0.05 + 0.02,
      offsetY: Math.random() * 0.05 + 0.02,
      offsetZ: Math.random() * 0.05 + 0.02,
      speedX: 0,  // Nouvelle variable pour la vitesse en X
      speedY: 0,  // Nouvelle variable pour la vitesse en Y
      speedZ: 0   // Nouvelle variable pour la vitesse en Z
    });
  }
}

// Fonction pour animer les particules (mouvement chaotique)
function animateParticles() {
  const time = performance.now() * 0.01;

  particles.forEach((particle) => {
    let latitude = particle.latitude;
    let longitude = particle.longitude;

    if (!isSeparated) {  // L'animation chaotique ne s'applique que si les particules ne sont pas séparées
      latitude += Math.sin(time * particle.offsetX);
      longitude += Math.cos(time * particle.offsetY);
    } else {
      // Si les particules sont séparées, conserver leur vitesse chaotique
      const x = parseFloat(particle.element.style.transform.match(/translate3d\(([^,]+)/)[1]);
      const y = parseFloat(particle.element.style.transform.match(/, ([^,]+)/)[1]);
      const z = parseFloat(particle.element.style.transform.match(/, ([^)]+)/)[1]);

      // Calculer la vitesse chaotique et l'ajouter à la position actuelle
      particle.speedX += Math.sin(time * particle.offsetX) * 0.05;
      particle.speedY += Math.cos(time * particle.offsetY) * 0.05;
      particle.speedZ += Math.sin(time * particle.offsetZ) * 0.05;

      // Appliquer la vitesse aux nouvelles positions des particules
      const chaoticX = x + particle.speedX;
      const chaoticY = y + particle.speedY;
      const chaoticZ = z + particle.speedZ;

      particle.element.style.transform = `translate3d(${chaoticX}px, ${chaoticY}px, ${chaoticZ}px)`;
      return;
    }

    // Recalculer les positions après mouvement chaotique, tout en maintenant la sphère
    const x = radius * Math.cos(latitude) * Math.cos(longitude);
    const y = radius * Math.sin(latitude);
    const z = radius * Math.cos(latitude) * Math.sin(longitude);

    particle.element.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

// Fonction pour séparer les particules (déplacement gauche/droite)
function separateParticles() {
  isSeparated = true;

  particles.forEach((particle) => {
    const transform = particle.element.style.transform.match(/translate3d\(([^,]+), ([^,]+), ([^)]+)/);
    const x = parseFloat(transform[1]);
    const y = parseFloat(transform[2]);
    const z = parseFloat(transform[3]);

    if (particle.color === 'red') {
      // Déplacer les particules rouges à gauche
      particle.speedX = -0.5; // Donner une vitesse initiale à la séparation des particules rouges
      particle.element.style.transform = `translate3d(${x - 50}px, ${y}px, ${z}px)`;
    } else if (particle.color === 'green') {
      // Déplacer les particules vertes à droite
      particle.speedX = 0.5; // Donner une vitesse initiale à la séparation des particules vertes
      particle.element.style.transform = `translate3d(${x + 50}px, ${y}px, ${z}px)`;
    }
  });

  document.getElementById('separateBtn').style.display = 'none';
  document.getElementById('mergeBtn').style.display = 'inline-block';
}

// Fonction pour fusionner les particules (retour aux positions initiales)
function mergeParticles() {
  isSeparated = false;

  particles.forEach((particle) => {
    // Remettre toutes les particules à leur position d'origine
    particle.element.style.transform = `translate3d(${particle.originalX}px, ${particle.originalY}px, ${particle.originalZ}px)`;
    particle.speedX = 0;  // Réinitialiser la vitesse
    particle.speedY = 0;
    particle.speedZ = 0;
  });

  document.getElementById('mergeBtn').style.display = 'none';
  document.getElementById('separateBtn').style.display = 'inline-block';
}

// Fonction pour déplacer la sphère avec la souris
let isDragging = false;
let previousX = 0;
let previousY = 0;
let rotationX = 0;
let rotationY = 0;

sphere.addEventListener('mousedown', (e) => {
  isDragging = true;
  previousX = e.clientX;
  previousY = e.clientY;
  sphere.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - previousX;
    const deltaY = e.clientY - previousY;

    rotationY += deltaX * 0.3;
    rotationX -= deltaY * 0.3;

    rotationX = Math.max(-90, Math.min(90, rotationX));

    sphere.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

    previousX = e.clientX;
    previousY = e.clientY;
  }
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  sphere.style.cursor = 'grab';
});
