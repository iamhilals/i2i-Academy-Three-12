import * as THREE from 'three';

document.body.style.margin = 0;
document.body.style.overflow = 'hidden';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); 

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(10, 20, 0);
scene.add(dirLight);

const groundGeo = new THREE.PlaneGeometry(20, 50);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

const playerGeo = new THREE.BoxGeometry(1, 1, 1);
const playerMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const player = new THREE.Mesh(playerGeo, playerMat);
player.position.set(0, 0.5, 5);
scene.add(player);

const ui = document.createElement('div');
ui.style.position = 'absolute';
ui.style.top = '20px';
ui.style.left = '20px';
ui.style.color = 'black';
ui.style.fontSize = '24px';
ui.style.fontFamily = 'Arial, sans-serif';
ui.style.fontWeight = 'bold';
document.body.appendChild(ui);

let score = 0;
let isGameOver = false;
const enemies = [];

const keys = { ArrowLeft: false, ArrowRight: false, a: false, d: false };
window.addEventListener('keydown', (e) => { if (keys[e.key] !== undefined) keys[e.key] = true; });
window.addEventListener('keyup', (e) => { if (keys[e.key] !== undefined) keys[e.key] = false; });

function spawnEnemy() {
    if (isGameOver) return;
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const enemy = new THREE.Mesh(geo, mat);
    enemy.position.set((Math.random() - 0.5) * 10, 0.5, -20);
    scene.add(enemy);
    enemies.push(enemy);
    setTimeout(spawnEnemy, 1000); 
}
spawnEnemy();

const playerBox = new THREE.Box3();
const enemyBox = new THREE.Box3();

function animate() {
    if (isGameOver) return;
    requestAnimationFrame(animate);

    if ((keys.ArrowLeft || keys.a) && player.position.x > -5) player.position.x -= 0.15;
    if ((keys.ArrowRight || keys.d) && player.position.x < 5) player.position.x += 0.15;

    playerBox.setFromObject(player);

    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];
        enemy.position.z += 0.2; 

        enemyBox.setFromObject(enemy);
        if (playerBox.intersectsBox(enemyBox)) {
            isGameOver = true;
            ui.innerHTML = `GAME OVER! Score: ${score} <br><br> <button onclick="location.reload()" style="padding:10px; font-size:16px; cursor:pointer;">Restart</button>`;
            return;
        }

        if (enemy.position.z > 10) {
            scene.remove(enemy);
            enemies.splice(i, 1);
            score += 10;
        }
    }

    ui.innerHTML = `Score: ${score}`;
    renderer.render(scene, camera);
}
animate();