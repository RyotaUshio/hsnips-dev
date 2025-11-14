APPS = Code Cursor
APP_DIR = $(HOME)/Library/Application Support/$@/User/globalStorage
EXTENSION_DIR = $(APP_DIR)/draivin.hsnips

.PHONY: install $(APPS)

install: $(APPS)

$(APPS):
	@if [ -d "$(APP_DIR)" ]; then \
		mkdir -p "$(EXTENSION_DIR)"; \
		ln -sfh $(realpath dist) "$(EXTENSION_DIR)/hsnips"; \
		echo "Installed hsnips snippets to $@"; \
	fi
