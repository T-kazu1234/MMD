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

// initialize
SummonAnzuClass.prototype.init = function () {
    "use strict";
    // 描画エリア
    const container = document.getElementById("world");

    // カメラの位置を設定
    $sao.camera.position.z = 30;

    // レンダラーを設定
    $sao.renderer.setPixelRatio(window.devicePixelRatio);
    $sao.renderer.setSize($sao.width, $sao.height);
    container.appendChild($sao.renderer.domElement);

    // シーンを設定（箱みたいなもの）
    $sao.scene.background = new THREE.Color(0xffffff);

    // グリッドを表示する（デバッグ用）
    const gridHelper = new THREE.PolarGridHelper(30, 10);
    gridHelper.position.y = -10;
    $sao.scene.add(gridHelper);

    // 環境光源（均等に光を当てる）
    const ambient = new THREE.AmbientLight(0x666666);
    $sao.scene.add(ambient);

    // 平行光源
    const DirectionalLight = new THREE.DirectionalLight(0x887766);
    DirectionalLight.position.set(-1, 1, 1).normalize();
    $sao.scene.add(DirectionalLight);

    // 
    container.appendChild($sao.stats.dom);

    // MMDモデルロード時の途中経過を監視
    const onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            const percentConplete = xhr.loaded / xhr.total * 100;
            window.console.log(Math.round(percentConplete, 2) + "% downloaded");
        }
    };

    // MMDモデルロード時のエラー処理
    const onError = function (xhr) {
        window.console.log(xhr);
    };

    // 光がメッシュの表面に当たった時どうのこうのなるやつ
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

    // 各種パラメータをON/OFFするやつ（デバッグ用）
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
        // dat.gui.min.js：
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

    // MMDモデルのファイルパス
//  const modelFile = "./models/111yuukiaine.pmx";
//  const modelFile = "./models/111yuukiaine.pmx";
//  const modelFile = "./models/111yuukiaine.pmx";
//  const modelFile = "./models/111yuukiaine.pmx";
//  const modelFile = "./models/111yuukiaine.pmx";
//  const modelFile = "./models/111yuukiaine.pmx";
    const modelFile = "./models/112湊みお.pmx";
    const vmdFiles = ["./models/haruhi.vmd"];

    // MMDLoader.js：MMDファイル読み込み用
    // mmdparser.min.js：依存ファイル
    // TGALoader.js：依存ファイル
    // CCDIKSolver.js：依存ファイル
    // MMDPhysics.js：依存ファイル
    // ammo.js：依存ファイル
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
