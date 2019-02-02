 <script>
      // �y�[�W�̓ǂݍ��݂�҂�
      window.addEventListener('DOMContentLoaded', init);

      function init() {
          // �|���t�B�����g�p
          const polyfill = new WebVRPolyfill();

          // �T�C�Y���w��
          const width = 960;
          const height = 540;

          // �����_���[���쐬
          const renderer = new THREE.WebGLRenderer({
              canvas: document.querySelector('#myCanvas'),
              antialias:true
          });
          renderer.setSize(width, height);
          
          // �����_���[��WebVR�ݒ��L���ɂ���
          renderer.vr.enabled = true;

          const container = document.getElementById('container');
          container.style.position = "relative";
          container.style.width = width;
          container.style.height = height;

          // WebVR�̊J�n�{�^����DOM�ɒǉ�
          container.appendChild(WEBVR.createButton(renderer));

          // �V�[�����쐬
          const scene = new THREE.Scene();

          // �J�������쐬
          const camera = new THREE.PerspectiveCamera(90, width / height);

          // �J�����p�R���e�i���쐬
          const cameraContainer = new THREE.Object3D();
          cameraContainer.add(camera);
          scene.add(cameraContainer);
          cameraContainer.position.y = 100;

          // �������쐬
          {
              const spotLight = new THREE.SpotLight(0xFFFFFF, 4, 2000, Math.PI / 5, 0.2, 1.5);
              spotLight.position.set(500, 300, 500);
              scene.add(spotLight);

              const ambientLight = new THREE.AmbientLight(0x333333);
              scene.add(ambientLight);
          }
          // �n�ʂ��쐬
          {
              // ���̃e�N�X�`���[
              const texture = new THREE.TextureLoader().load('imgs/floor.png');
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping; // ���s�[�g�\��
              texture.repeat.set(10, 10); // 10x10�}�X�ɐݒ�
              texture.magFilter = THREE.NearestFilter;
              const floor = new THREE.Mesh(
                  new THREE.PlaneGeometry(1000, 1000),
                  new THREE.MeshStandardMaterial({map: texture, roughness: 0.0, metalness: 0.6}),
              );
              floor.rotation.x = -Math.PI / 2;
              scene.add(floor);
          }
          const boxList = [];
          // �����̂��쐬
          {
              // �����̂̃W�I���g�����쐬
              const geometry = new THREE.BoxGeometry(45, 45, 45);
              // �����̂𕡐��쐬�������_���ɔz�u
              const num = 60;
              loop: for (let i = 0; i < num; i++) {
                  const px = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
                  const pz = Math.round((Math.random() - 0.5) * 19) * 50 + 25;
                  for (let j = 0; j < i; j++) {
                      const box2 = boxList[j];
                      if(box2.position.x === px && box2.position.z === pz){
                          i -= 1;
                          continue loop;
                      }
                  }
                  // �����̂̃}�e���A�����쐬
                  const material = new THREE.MeshStandardMaterial({color: 0x1000000 * Math.random(), roughness: 0.1, metalness: 0.5});
                  const box = new THREE.Mesh(geometry, material);
                  box.position.x = px;
                  box.position.y = 25;
                  box.position.z = pz;
                  scene.add(box);
                  boxList.push(box);
              }
          }

          // �����_���[�Ƀ��[�v�֐���o�^
          renderer.setAnimationLoop(tick);
          
          let time = 0;
          
          // ���t���[�����Ɏ��s����郋�[�v�C�x���g
          function tick() {
              time += 1;
              
              // �����̂𓮂���
              const length = boxList.length;
              for (let i = 0; i < length; i++) {
                  boxList[i].position.y = 125 + 100 * Math.cos(time * 0.0005 * i + i / 10);
              }
              
              // �����_�����O
              renderer.render(scene, camera);
          }
      }
  </script>