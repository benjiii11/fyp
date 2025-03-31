# Cowboy BLitz
This is a project about a game based on Hangman Blitz. 

<ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.instructionText}>
            This is a game of hangman with a twist — where there is a timer instead of lives like in traditional hangman.
            The zombies have invaded, and they will slowly eat you up unless you solve the word in time.
          </Text>

          <Text style={styles.instructionText}>
            There are different modes where you can challenge yourself to beat your high score:
          </Text>

          <Text style={styles.subHeader}>Practice Mode:</Text>
          <Text style={styles.instructionText}>
            Easy, Normal, and Hard modes are for practice. The zombie will slowly make its way toward your brains!
          </Text>

          <Text style={styles.subHeader}>Challenge Mode:</Text>
          <Text style={styles.instructionText}>
            The real challenge is here! For every wrong guess, the zombie will leap toward you. For every correct guess,
            you will knock the zombie back a little. Be warned: the words get tougher the longer you survive.
          </Text>

          <Text style={styles.subHeader}>How to Play:</Text>
          <Text style={styles.instructionText}>
            A zombie is coming for your brains! Solve the hidden word before it reaches you. Press any letter on the on-screen
            keyboard to guess. When the full word is revealed, your cowboy will shoot the zombie down and reset the challenge.
          </Text>

          <Text style={styles.subHeader}>Challenge Mechanics Recap:</Text>
          <Text style={styles.instructionText}>
            For each wrong guesses, the zombie will leap towards you! For each right guesses, you will be able to knock the zombie back!
          </Text>

          <Text style={styles.instructionText}>Good luck, and defend your brains!</Text>
        </ScrollView>
