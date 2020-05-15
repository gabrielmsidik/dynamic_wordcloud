import { isOverlapping, pickRandom } from "../.././utils/index";


let colors = [
    "rgb(91, 94, 166)",
    "rgb(119, 33, 46)",
    "navy",
    "rgb(57, 70, 96)",
    "rgb(149, 82, 81)"
]

export default class DynamicWordCloud{

    constructor(canvas) {
        
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.word_objects = [];

    }

    update_word_cloud(input_text, input_size) {

        this.word_objects = decomposeExistingWords(this.word_objects);
        this.word_objects = this.word_objects.filter(check_min_size);
        this.word_objects = addWord(this.word_objects, input_text, input_size, this.canvas);

        console.log(this.word_objects);

    }

    display() {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.word_objects = deOverlapWordRectangles(this.word_objects, this.context);

        this.word_objects = centralizeWordRectangles(this.word_objects, this.canvas);

        for (let wordRect of this.word_objects) {
            wordRect.draw();
        }
    }

    animate() {

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.display();
        requestAnimationFrame(this.animate.bind(this));

    }
}


function check_min_size(word_rect) {
    return word_rect.height > 10;
}
function deOverlapWordRectangles(input_word_rectangles) {

    let overlappingExist = true;
    let counter = 0;
    let limit = 1000;

    let output_word_rectangles = Object.assign([], input_word_rectangles);

    overlappingExist = false;

    for (let word_rect1 of output_word_rectangles) {
        for (let word_rect2 of output_word_rectangles) {
            if (word_rect1.word !== word_rect2.word && isOverlapping(word_rect1, word_rect2)){

                overlappingExist = true;

                // NOTE: pushApart is a destructive method
                pushApart(word_rect1, word_rect2);
            }
        }
    }

    // output_word_rectangles = centrify(output_word_rectangles, canvas);

    return output_word_rectangles

}

function pushApart(word_rect1, word_rect2) {
    
    let push_vector_x = word_rect1.mid_x - word_rect2.mid_x;
    let push_vector_y = word_rect1.mid_y - word_rect2.mid_y;

    if (push_vector_x > 0) {
        word_rect1.move(1, 0);
        word_rect2.move(-1, 0);
    } else {
        word_rect1.move(-1, 0);
        word_rect2.move(1, 0);
    }

    if (push_vector_y > 0) {
        word_rect1.move(0, 1);
        word_rect2.move(0, -1);
    } else {
        word_rect1.move(0, -1);
        word_rect2.move(0, 1);
    }
}

function centralizeWordRectangles(input_word_rectangles, canvas) {

    let squeezed_word_rectangles = Object.assign([], input_word_rectangles);

    for (let current_word_rectangle of squeezed_word_rectangles) {
        // NOTE: shift_towards_center is a destructive method
        shift_towards_center(current_word_rectangle, squeezed_word_rectangles, canvas)
    }

    let output_word_rectangles = squeezed_word_rectangles;
    // let output_word_rectangles = centrify(squeezed_word_rectangles, canvas);
    return output_word_rectangles
}

// NOTE: shift_towards_center is a destructive method
function shift_towards_center(current_word_rectangle, input_word_rectangles, canvas) {

    const threshold = 10;

    let canShiftX = true;
    let canShiftY = true;

    const canvas_mid_x = canvas.width / 2;
    const canvas_mid_y = canvas.height / 2;

    let x_component_to_center = canvas_mid_x - current_word_rectangle.mid_x;
    let y_component_to_center = canvas_mid_y - current_word_rectangle.mid_y;

    let move_right = false;
    let move_left = false;
    let move_up = false;
    let move_down = false;

    if (x_component_to_center < -threshold) {
        move_left = true;
    }

    if (x_component_to_center > threshold) {
        move_right = true;
    }

    if (y_component_to_center < -threshold) {
        move_up = true;
    }

    if (y_component_to_center > threshold) {
        move_down = true;
    }

    if (canShiftX && move_left) {

        let test_word_rectangle = Object.assign(
            Object.create(current_word_rectangle), current_word_rectangle
        );

        test_word_rectangle.move(-1, 0);

        for (let word_rectangle of input_word_rectangles) {
            if (word_rectangle.word !== test_word_rectangle.word) {
                if (isOverlapping(word_rectangle, test_word_rectangle)) {
                    canShiftX = false;
                }
            }
        }

        if (canShiftX) {
            current_word_rectangle.move(-1, 0);
        }

    } else if (canShiftX && move_right) {
        let test_word_rectangle = Object.assign(
            Object.create(current_word_rectangle), current_word_rectangle
        );

        test_word_rectangle.move(1, 0);

        for (let word_rectangle of input_word_rectangles) {
            if (word_rectangle.word !== test_word_rectangle.word) {
                if (isOverlapping(word_rectangle, test_word_rectangle)) {
                    canShiftX = false;
                }
            }
        }

        if (canShiftX) {
            current_word_rectangle.move(1, 0);
        }
    } else {
        canShiftX = false;
    }

    if (canShiftY && move_down) {

        let test_word_rectangle = Object.assign(
            Object.create(current_word_rectangle), current_word_rectangle
        );

        test_word_rectangle.move(0, 1);

        for (let word_rectangle of input_word_rectangles) {
            if (word_rectangle.word !== test_word_rectangle.word) {
                if (isOverlapping(word_rectangle, test_word_rectangle)) {
                    canShiftY = false;
                }
            }
        }

        if (canShiftY) {
            current_word_rectangle.move(0, 1);
        }

    } else if (canShiftY && move_up) {

        let test_word_rectangle = Object.assign(
            Object.create(current_word_rectangle), current_word_rectangle
        );

        test_word_rectangle.move(0, -1);

        for (let word_rectangle of input_word_rectangles) {
            if (word_rectangle.word !== test_word_rectangle.word) {
                if (isOverlapping(word_rectangle, test_word_rectangle)) {
                    canShiftY = false;
                }
            }
        }

        if (canShiftY) {
            current_word_rectangle.move(0, -1);
        }
    } else {
        canShiftY = false;
    }
}

function centrify(input_word_rectangles, canvas) {

    let output_word_rectangles = []

    let total_weighted_x = 0;
    let total_weighted_y = 0;

    let total_weight = 0;

    for (let word_rect of input_word_rectangles) {
        total_weighted_x += word_rect.mid_x * word_rect.height;
        total_weighted_y += word_rect.mid_y * word_rect.height;
        total_weight += word_rect.height;
    }

    let average_x = total_weighted_x / total_weight;
    let average_y = total_weighted_y / total_weight;

    let delta_x = average_x - canvas.width / 2;
    let delta_y = average_y - canvas.height / 2;

    for (let word_rect of input_word_rectangles) {

        let new_word_rect = Object.assign(Object.create(word_rect), word_rect);
        new_word_rect.move(-delta_x, -delta_y);
        output_word_rectangles.push(new_word_rect);
    }

    return output_word_rectangles;
}

function addWord(input_word_rectangles, input_text, text_size, canvas) {

    let output_word_rectangles;

    let isNewWord = !checkIfWordExist(input_word_rectangles, input_text);

    if (isNewWord) {
        output_word_rectangles = addNonOverlappingWord(input_word_rectangles, input_text, text_size, canvas);
    } else {
        output_word_rectangles = incrementExistingWord(input_word_rectangles, input_text, text_size);
    }

    return output_word_rectangles;
}

function incrementExistingWord(input_word_rectangles, input_text, text_size) {

    let output_word_rectangles = [];

    for (let word_rect of input_word_rectangles) {

        let new_word_rect = Object.assign(Object.create(word_rect), word_rect);
        
        if (new_word_rect.word == input_text) {
            new_word_rect.incrementSize(Math.floor(text_size) * 2);
        }

        output_word_rectangles.push(new_word_rect);
    }

    return output_word_rectangles;
} 

function decomposeExistingWords(input_word_rectangles) {

    let output_word_rectangles = [];

    let weight = input_word_rectangles.reduce((a, b) => a + b.height * b.word.length, 0);


    if (weight > 2000) {

        for (let word_rect of input_word_rectangles) {
    
            let decomposed_word_rect = Object.assign(
                Object.create(word_rect), word_rect
            );

            if (decomposed_word_rect.target_height < 40) {
                decomposed_word_rect.decrementSize(1);
            } else if (decomposed_word_rect.target_height < 60){
                let decrement = Math.floor(decomposed_word_rect.target_height * 0.1);
                decomposed_word_rect.decrementSize(decrement);
            } else {
                let decrement = Math.floor(decomposed_word_rect.target_height * 0.2);
                decomposed_word_rect.decrementSize(decrement);
            }
            output_word_rectangles.push(decomposed_word_rect);
    
        }


    } else if (weight > 1000) {
        for (let word_rect of input_word_rectangles) {
    
            let decomposed_word_rect = Object.assign(
                Object.create(word_rect), word_rect
            );

            if (decomposed_word_rect.target_height < 40) {
                decomposed_word_rect.decrementSize(1);
            } else {

                // if bigger than 30 decrease by 5%
                let decrement = Math.floor(decomposed_word_rect.target_height * 0.05);
                decomposed_word_rect.decrementSize(decrement);

            }
            output_word_rectangles.push(decomposed_word_rect);
    
        }
    } else {
        return input_word_rectangles;
    }

    return output_word_rectangles;

}

function checkIfWordExist(input_word_rectangles, input_text) {

    for (let word_rect of input_word_rectangles) {
        if (word_rect.word == input_text) {
            return true;
        }
    }

    return false;
}

function addNonOverlappingWord(input_word_rectangles, input_text, text_size, canvas) {

    let output_word_rectangles = Object.assign([], input_word_rectangles);

    let newWordRect;
    let overlappingCurrentWords = true;

    while (overlappingCurrentWords) {

        let margin = 0.15
    
        let mid_x = ((1 - 2 * margin) * Math.random() + margin) * canvas.width;
        let mid_y = ((1 - 2 * margin) * Math.random() + margin) * canvas.height;
        const height = Math.floor(text_size);

        overlappingCurrentWords = false;

        newWordRect = new WordRectangle(input_text, mid_x, mid_y, height, pickRandom(colors), canvas)

        for (let wordRect of output_word_rectangles) {
            if (isOverlapping(newWordRect, wordRect)) {
                overlappingCurrentWords = true;
            } 
        }
    }

    output_word_rectangles.push(newWordRect);

    return output_word_rectangles;
}

function display() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    word_rectangles = deOverlapWordRectangles(word_rectangles);
    word_rectangles = centralizeWordRectangles(word_rectangles, canvas);
    for (let wordRect of word_rectangles) {
        wordRect.draw();
    }
}

class WordRectangle {

    constructor(word, mid_x, mid_y, height, color, canvas) {

        this.word = word;
        this.mid_x = mid_x;
        this.mid_y = mid_y;
        this.height = height;
        this.target_height = height;
        this.loop_stage = 0;
        this.loop = 5;
        this.color = color;
        this.canvas = canvas;

    }

    move(x_shift, y_shift) {
        this.mid_x = this.mid_x + x_shift;
        this.mid_y = this.mid_y + y_shift;
    }

    incrementSize(increment_amount) {
        this.target_height = this.target_height + increment_amount;
    }

    decrementSize(decrement_amount) {
        this.target_height = this.target_height - decrement_amount;
    }

    getLength() {
        return this.height * Math.ceil(this.word.length / 3 ) 
    }
    
    // top left corner coordinates
    get_x1() {
        return this.mid_x - this.getLength() * 0.5;
    }
    get_y1() {
        return this.mid_y - this.height * 0.5
    }

    // bottom right corner coordinates
    get_x2() {
        return this.mid_x + this.getLength() * 0.5;
    }
    get_y2() {
        return this.mid_y + this.height * 0.5;
    }

    getRectangle() {
        return new Rectangle(
            this.get_x1(), this.get_y1(), this.get_x2(), this.get_y2()
        )
    }

    getWordObject() {
        return new Word(
            this.word, this.get_x1(), this.get_y1(), this.get_x2(), this.get_y2(), this.color, this.canvas
        )
    }

    draw() {

        this.loop_stage = (this.loop_stage + 1) % this.loop

        if (this.loop_stage === 0) {

            let diff = Math.abs(this.target_height - this.height);
    
            if (this.target_height > this.height) {
                this.height += 1;
            } else if (this.target_height < this.height) {
                this.height -= 1;
            }

        }
        this.getWordObject().draw();
    }
}

class Rectangle {
    constructor(x1, y1, x2, y2) {

        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;

    }

    draw() {

        ctx.beginPath();
        ctx.strokeRect(this.x1, this.y1, this.x2 - this.x1, this.y2 - this.y1);
        ctx.stroke();
        ctx.closePath();
    }
}

class Word {

    constructor(word, x1, y1, x2, y2, color, canvas) {

        this.word = word;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
        this.canvas = canvas
        this.context = canvas.getContext("2d");

    }

    draw() {

        const center_x = (this.x2 - this.x1) * 0.5 + this.x1;
        const base_y = (this.y2 - this.y1) * 0.75 + this.y1;

        let fontSize = Math.floor((this.y2 - this.y1) * 0.75);
        const fontFormat = "px Segoe UI Light";

        this.context.font = "" + fontSize + fontFormat;
        this.context.fillStyle = this.color;
        this.context.textAlign = "center";

        let metrics = this.context.measureText(this.word);
        let textWidth = metrics.width;

        while (textWidth > this.x2 - this.x1) {

            fontSize -= 1
            this.context.font = "" + fontSize + fontFormat;

            metrics = this.context.measureText(this.word);
            textWidth = metrics.width;

        }

        this.context.fillText(this.word, center_x, base_y);
    }
}