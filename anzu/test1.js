/* global THREE, Stats, dat */
// constructor
const SummonAnzuClass = function () {
    "use strict";
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.halfX = this.width / 2;
    this.halfY = this.height / 2;
    this.mouseX = 0;
    this.mouseY = 0;
    this.physicsHelper = null;
    this.ikHelper = null;
    this.clock = new THREE.Clock();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 1, 2000);
    this.scene = new THREE.Scene();
    this.stats = new Stats();	// stats.min.js
    this.helper = new THREE.MMDHelper();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.effect = new THREE.OutlineEffect(this.renderer);	// OutlineEffect.js
};

/*VR �y�[�W�̓ǂݍ��݂�҂�
window.addEventListener('DOMContentLoaded', init);

// initialize

function init() {
    //VR �|���t�B�����g�p
    const polyfill = new WebVRPolyfill();
/*
    // �T�C�Y���w��
    const width = 960;
    const height = 540;

    // �����_���[���쐬
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#myCanvas'),
        antialias:true
    });
    renderer.setSize(width, height);
          
    //VR �����_���[��WebVR�ݒ��L���ɂ���
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
    */



SummonAnzuClass.prototype.init = function () {
    "use strict";
    // �`��G���A
    const container = document.getElementById("world");

    // �J�����̈ʒu��ݒ�
    $sao.camera.position.z = 30;

    // �����_���[��ݒ�
    $sao.renderer.setPixelRatio(window.devicePixelRatio);
    $sao.renderer.setSize($sao.width, $sao.height);
    container.appendChild($sao.renderer.domElement);

    // �V�[����ݒ�i���݂����Ȃ��́j
    $sao.scene.background = new THREE.Color(0xffffff);

    // �O���b�h��\������i�f�o�b�O�p�j
    const gridHelper = new THREE.PolarGridHelper(30, 10);
    gridHelper.position.y = -10;
    $sao.scene.add(gridHelper);

    // �������i�ϓ��Ɍ��𓖂Ă�j
    const ambient = new THREE.AmbientLight(0x666666);
    $sao.scene.add(ambient);

    // ���s����
    const DirectionalLight = new THREE.DirectionalLight(0x887766);
    DirectionalLight.position.set(-1, 1, 1).normalize();
    $sao.scene.add(DirectionalLight);

    // 
    container.appendChild($sao.stats.dom);

    // MMD���f�����[�h���̓r���o�߂��Ď�
    const onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            const percentConplete = xhr.loaded / xhr.total * 100;
            window.console.log(Math.round(percentConplete, 2) + "% downloaded");
        }
    };

    // MMD���f�����[�h���̃G���[����
    const onError = function (xhr) {
        window.console.log(xhr);
    };

    // �������b�V���̕\�ʂɓ����������ǂ��̂����̂Ȃ���
    let phongMaterials;
    let originalMaterials;
    const makePhongMaterials = function (materials) {
        let array = [];
        let m;

        for (let i = 0, len = materials.length; i < len; i++) {
            m = new THREE.MeshPhongMaterial();
            m.copy(materials[i]);
            m.needsUpdate = true;
            array.push(m);
        }

        phongMaterials = array;
    };

    // �e��p�����[�^��ON/OFF�����i�f�o�b�O�p�j
    const initGui = function (mesh) {
        const api = {
            "animation": true,
            "gradient_mapping": true,
            "ik": true,
            "outline": true,
            "physics": true,
            "show_IK_bones": false,
            "show_rigid_bodies": false
        };
        // dat.gui.min.js�F
        const gui = new dat.GUI();
        gui.add(api, "animation").onChange(function () {
            $sao.helper.doAnimation = api.animation;
        });
        gui.add(api, "gradient_mapping").onChange(function () {
            if (originalMaterials === undefined) {
                originalMaterials = mesh.material;
            }

            if (phongMaterials === undefined) {
                makePhongMaterials(mesh.material);
            }

            if (api.gradient_mapping) {
                mesh.material = originalMaterials;
            } else {
                mesh.material = phongMaterials;
            }
        });
        gui.add(api, "ik").onChange(function () {
            $sao.helper.doIk = api.ik;
        });
        gui.add(api, "outline").onChange(function () {
            $sao.effect.enabled = api.outline;
        });
        gui.add(api, "show_IK_bones").onChange(function () {
            $sao.ikHelper.visible = api.show_IK_bones;
        });
        gui.add(api, "show_rigid_bodies").onChange(function () {
            if ($sao.physicsHelper !== undefined) {
                $sao.physicsHelper.visible = api.show_rigid_bodies;
            }
        });
    };

    // MMD���f���̃t�@�C���p�X
//  const modelFile = "./models/111yuukiaine.pmx";
//  const modelFile = "./models/111yuukiaine.pmx";
//  const modelFile = "./models/111yuukiaine.pmx";
//  const modelFile = "./models/111yuukiaine.pmx";
//  const modelFile = "./models/111yuukiaine.pmx";
//  const modelFile = "./models/111yuukiaine.pmx";
    const modelFile = "./models/112mio.pmx";
    const vmdFiles = ["./models/haruhi.vmd"];

    // MMDLoader.js�FMMD�t�@�C���ǂݍ��ݗp
    // mmdparser.min.js�F�ˑ��t�@�C��
    // TGALoader.js�F�ˑ��t�@�C��
    // CCDIKSolver.js�F�ˑ��t�@�C��
    // MMDPhysics.js�F�ˑ��t�@�C��
    // ammo.js�F�ˑ��t�@�C��
    const loader = new THREE.MMDLoader();
    loader.load(
		modelFile,
		vmdFiles,
		function (object) {
		    const mesh = object;
		    mesh.position.y = -10;
		    $sao.scene.add(mesh);
		    $sao.helper.add(mesh);
		    $sao.helper.setAnimation(mesh);

		    $sao.ikHelper = new THREE.CCDIKHelper(mesh);
		    $sao.ikHelper.visible = false;
		    $sao.scene.add($sao.ikHelper);

		    $sao.helper.setPhysics(mesh);
		    $sao.physicsHelper = new THREE.MMDPhysicsHelper(mesh);
		    $sao.physicsHelper.visible = false;
		    $sao.scene.add($sao.physicsHelper);

		    $sao.helper.unifyAnimationDuration({ afterglow: 2.0 });

		    //initGui(mesh);
		    $sao.animate();
		},
		onProgress,
		onError
	);
};

SummonAnzuClass.prototype.animate = function () {
    window.requestAnimationFrame($sao.animate);
    $sao.stats.begin();
    $sao.render();
    $sao.stats.end();
};

SummonAnzuClass.prototype.render = function () {
    $sao.helper.animate($sao.clock.getDelta());

    if ($sao.physicsHelper !== undefined && $sao.physicsHelper.visible) {
        $sao.physicsHelper.update();
    }

    if ($sao.ikHelper !== undefined && $sao.ikHelper.visible) {
        $sao.ikHelper.update();
    }

    $sao.effect.render($sao.scene, $sao.camera);
};

SummonAnzuClass.prototype.onWindowResize = function () {
    $sao.width = window.innerWidth;
    $sao.height = window.innerHeight;
    $sao.halfX = window.innerWidth / 2;
    $sao.halfY = window.innerHeight / 2;
    $sao.camera.aspect = $sao.width / $sao.height;
    $sao.camera.updateProjectionMatrix();
    $sao.effect.setSize($sao.width, $sao.height);
};

const $sao = new SummonAnzuClass();
window.addEventListener("resize", $sao.onWindowResize, false);
window.addEventListener("DOMContentLoaded", function () {
    "use strict";
    $sao.init();
}, false);
