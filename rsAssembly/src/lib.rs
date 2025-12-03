
use wasm_bindgen::prelude::*;

// 导出一个简单的加法函数给 JavaScript 调用
#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

// 导出一个字符串处理函数
#[wasm_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to WebAssembly!", name)
}

// 导出一个斐波那契数列计算函数
#[wasm_bindgen]
pub fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}

// 在 WebAssembly 模块加载时自动执行
#[wasm_bindgen(start)]
pub fn run() -> Result<(), JsValue> {
    // 设置 panic hook 以便更好的错误处理
    console_error_panic_hook::set_once();
    
    // 在控制台输出信息
    web_sys::console::log_1(&"Rust WebAssembly 模块已加载!".into());
    
    Ok(())
}
