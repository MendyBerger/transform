import { LitElement, html, css, property } from 'lit-element';
import './my-resizer';

export class ImageTransform extends LitElement {
    @property({ type: String }) title = 'My app';

    static styles = css`
        :host {
            min-height: 90vh;
            display: flex;
            flex-direction: column;
            padding: 0 100px;
        }
        my-resizer {
            margin: 100px 100px;
        }
    `;

    render() {
        return html`
            <main>
                <my-resizer>
                    <img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png">
                </my-resizer>
            </main>
        `;
    }
}

customElements.define('image-transform', ImageTransform);
