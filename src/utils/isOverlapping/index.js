export default function(wordRect1, wordRect2) {

    // is rect1 ____ of the left of rect2

    let left = wordRect1.get_x2() <= wordRect2.get_x1();
    let right = wordRect1.get_x1() >= wordRect2.get_x2();
    let up = wordRect1.get_y2() <= wordRect2.get_y1();
    let down = wordRect1.get_y1() >= wordRect2.get_y2();

    return ! (left || right || up || down)

}