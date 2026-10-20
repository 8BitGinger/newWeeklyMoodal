class UIStore {
	cityModalOpen = $state(true);
	cityModalInvalid = $state(false);
	wrapModalOpen = $state(false);

	openCityModal() {
		this.cityModalOpen = true;
		this.cityModalInvalid = false;
	}

	closeCityModal() {
		this.cityModalOpen = false;
	}

	markCityInvalid() {
		this.cityModalInvalid = true;
		this.cityModalOpen = true;
	}

	openWrapModal() {
		this.wrapModalOpen = true;
	}

	closeWrapModal() {
		this.wrapModalOpen = false;
	}
}

export const uiStore = new UIStore();
