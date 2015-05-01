
module DMD {
    export class VisibleSettingPanel extends showv.View {
        private visibleSettingPanelTpl = new HBSTemplate('client/visible-setting-panel');
        public url: string;
        public size: any;
        public offset: any;
        private vspU: JQuery;
        private vspW: JQuery;
        private vspH: JQuery;
        private vspL: JQuery;
        private vspT: JQuery;
        constructor() {
            super({
                id: "visible-setting-panel"
            });
        }
        render(): VisibleSettingPanel {
            this.$el.append(this.visibleSettingPanelTpl.render());

            this.vspU = $('#vsp-u', this.$el);
            this.vspW = $('#vsp-w', this.$el);
            this.vspH = $('#vsp-h', this.$el);
            this.vspL = $('#vsp-l', this.$el);
            this.vspT = $('#vsp-t', this.$el);

            window.onresize = (ev: Event) => {this.detect(ev).display();};
            window.onscroll = (ev: Event) => {this.detect(ev).display();};

            this.detect().display();
            return this;
        }
        events(): Object {
            return {
                "click #commit-current-setting": "onCommit",
                "keyup input[type=number]": "affect"
            };
        }
        onCommit(ev: Event) {
            // send message
            chrome.runtime.sendMessage(null, {
                action: 'setOption',
                params: {
                    id: DMD.GameFactory.getIdFromUrl(this.url),
                    options: {
                        visibleSettingEnabled: false
                    },
                    offset: this.offset,
                    size: this.size
                }
            }, (res) => {
                if (window.confirm(
                    "設定を保存しました。ページをリロードします。\n\n" +
                    "この設定を#demado_memoでツイートしますか？\n" +
                    "知見の共有にご協力ください >_<"
                    )) window.open("https://twitter.com/intent/tweet?hashtags=demado_memo&text=" + this.toTweetText());
                location.reload();
            });
        }
        detect(ev?: Event): VisibleSettingPanel {
            var src: any;
            if (ev) {
                src = ev.currentTarget;
            } else {
                src = window;
            }
            this.url = location.href;
            this.size = {
                width:  src.innerWidth,
                height: src.innerHeight
            };
            this.offset = {
                left: src.scrollX,
                top: src.scrollY
            };
            return this;
        }
        display() {
            this.vspU.html(location.href);
            this.vspW.val(this.size.width);
            this.vspH.val(this.size.height);
            this.vspL.val(this.offset.left);
            this.vspT.val(this.offset.top);
        }
        affect() {
            this.size = {
                width: this.vspW.val(),
                height: this.vspH.val()
            };
            this.offset = {
                left: this.vspL.val(),
                top: this.vspT.val()
            };
            var diffH = window.outerHeight - window.innerHeight;
            var diffW = window.outerWidth - window.innerWidth;
            window.resizeTo(parseInt(this.size.width) + diffW, parseInt(this.size.height) + diffH);
            window.scrollTo(this.offset.left, this.offset.top);
        }

        /**
         * これここにあるべきじゃないっしょーw
         * @returns {string}
         */
        toTweetText(): string {
            var message: string = document.title + "\n" +
                    "URL:" + this.url + "\n" +
                    "SIZE:" + "width " + this.size.width  +  " height " + this.size.height + "\n" +
                    "OFFSET:" + "left " + this.offset.left  + " top " + this.offset.top;
            return encodeURIComponent(message);
        }
    }
}