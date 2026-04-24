import * as Cesium from 'cesium';

let viewer;

export function initCesium() {
	viewer = new Cesium.Viewer('cesiumContainer', {
		terrain: Cesium.Terrain.fromWorldTerrain(),
		timeline: false,
		animation: false,
		baseLayerPicker: false,
		geocoder: false,
		homeButton: false,
		infoBox: false,
		sceneModePicker: false,
		selectionIndicator: false,
		navigationHelpButton: false,
		fullscreenButton: false,
		shouldAnimate: false
	});

	viewer.scene.requestRenderMode = false;
	viewer.scene.maximumRenderTimeChange = 0;
	viewer.scene.globe.maximumScreenSpaceError = 2;
	viewer.resolutionScale = 0.75;

	viewer.scene.screenSpaceCameraController.enableRotate = false;
	viewer.scene.screenSpaceCameraController.enableTranslate = false;
	viewer.scene.screenSpaceCameraController.enableZoom = false;
	viewer.scene.screenSpaceCameraController.enableTilt = false;
	viewer.scene.screenSpaceCameraController.enableLook = false;
	viewer.scene.screenSpaceCameraController.maximumZoomDistance = 25000000;

	viewer.scene.globe.tileCacheSize = 2048;
	viewer.scene.globe.preloadAncestors = true;
	viewer.scene.globe.preloadSiblings = true;
	viewer.scene.globe.loadingDescendantLimit = 20;
	viewer.scene.globe.skipLevelOfDetail = true;
	viewer.scene.globe.baseScreenSpaceError = 1024;
	viewer.scene.globe.skipScreenSpaceErrorFactor = 16;
	viewer.scene.globe.skipLevels = 1;

	viewer.scene.globe.enableLighting = true;
	viewer.scene.highDynamicRange = false;
	viewer.scene.postProcessStages.fxaa.enabled = true;
	viewer.scene.skyAtmosphere = new Cesium.SkyAtmosphere();
	viewer.scene.fog.enabled = true;
	viewer.scene.fog.density = 0.0001;

	viewer._cesiumWidget._creditContainer.style.display = 'none';

	setControlsEnabled(false);
	return viewer;
}

export function setRenderOptimization(isMenu) {
	if (!viewer) return;
	viewer.scene.requestRenderMode = !isMenu;
	viewer.scene.maximumRenderTimeChange = !isMenu ? Infinity : 0;
}

export function setControlsEnabled(enabled) {
	if (!viewer) return;
	const ctrl = viewer.scene.screenSpaceCameraController;
	ctrl.enableRotate = enabled;
	ctrl.enableTranslate = enabled;
	ctrl.enableZoom = enabled;
	ctrl.enableTilt = enabled;
	ctrl.enableLook = enabled;
}

export function setCameraToPlane(lon, lat, alt, heading, pitch, roll) {
	if (!viewer) return;
	viewer.camera.setView({
		destination: Cesium.Cartesian3.fromDegrees(lon, lat, alt),
		orientation: {
			heading: Cesium.Math.toRadians(heading),
			pitch: Cesium.Math.toRadians(pitch),
			roll: Cesium.Math.toRadians(roll)
		}
	});
	viewer.scene.requestRender();
}

export function getViewer() {
	return viewer;
}
