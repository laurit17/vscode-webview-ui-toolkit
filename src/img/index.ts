import { FASTElement, customElement, html, attr } from "@microsoft/fast-element";

const imgTemplate = html<vsCodeImg>`
    <img src=${x => x.src}
        height=${x => x.height}
        width=${x => x.width} />
`;

@customElement({
    name: "vscode-img",
    template: imgTemplate,
})
export class vsCodeImg extends FASTElement {
    @attr src: string;
    @attr height: number;
    @attr width: number;
};

