#!/bin/bash

echo "🔧 Java 17 Installation Helper for macOS"
echo "========================================"
echo ""

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    
    # Add Homebrew to PATH for Apple Silicon Macs
    if [ -f /opt/homebrew/bin/brew ]; then
        echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
        eval "$(/opt/homebrew/bin/brew shellenv)"
    fi
fi

echo "✅ Homebrew installed"
echo ""

# Check if Java 17 is already installed
if /usr/libexec/java_home -V 2>&1 | grep -q "17"; then
    echo "✅ Java 17 is already installed!"
    JAVA_17_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)
    if [ -n "$JAVA_17_HOME" ]; then
        echo "   Java 17 found at: $JAVA_17_HOME"
        echo ""
        echo "To use Java 17, add to ~/.zshrc:"
        echo "  export JAVA_HOME=\"$JAVA_17_HOME\""
        echo "  export PATH=\"\$JAVA_HOME/bin:\$PATH\""
    fi
    exit 0
fi

echo "📥 Installing OpenJDK 17..."
brew install openjdk@17

echo ""
echo "🔗 Linking Java 17..."

# Detect architecture
if [ "$(uname -m)" = "arm64" ]; then
    # Apple Silicon
    sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
    JAVA_HOME_PATH="/opt/homebrew/opt/openjdk@17"
else
    # Intel
    sudo ln -sfn /usr/local/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
    JAVA_HOME_PATH="/usr/local/opt/openjdk@17"
fi

echo ""
echo "📝 Adding Java 17 to PATH..."

# Add to .zshrc
if ! grep -q "openjdk@17" ~/.zshrc 2>/dev/null; then
    echo "" >> ~/.zshrc
    echo "# Java 17" >> ~/.zshrc
    echo "export PATH=\"$JAVA_HOME_PATH/bin:\$PATH\"" >> ~/.zshrc
    echo "export JAVA_HOME=\"$JAVA_HOME_PATH\"" >> ~/.zshrc
fi

# Add to .bash_profile if it exists
if [ -f ~/.bash_profile ]; then
    if ! grep -q "openjdk@17" ~/.bash_profile 2>/dev/null; then
        echo "" >> ~/.bash_profile
        echo "# Java 17" >> ~/.bash_profile
        echo "export PATH=\"$JAVA_HOME_PATH/bin:\$PATH\"" >> ~/.bash_profile
        echo "export JAVA_HOME=\"$JAVA_HOME_PATH\"" >> ~/.bash_profile
    fi
fi

echo ""
echo "✅ Java 17 installed successfully!"
echo ""
echo "🔄 Please run: source ~/.zshrc"
echo "   OR open a new terminal"
echo ""
echo "🧪 Verify installation:"
echo "   java -version"
echo ""

