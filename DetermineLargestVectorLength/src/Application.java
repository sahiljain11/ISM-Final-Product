import java.util.*;
import java.io.*;

public class Application {

    public static void main (String[] args) throws IOException {

	Scanner kb = new Scanner(new File("train-balanced.csv"));
	FileWriter fileWriter = new FileWriter(new File("cleaned-training-set.csv"));

	int maxVectorLength = 0;

	while (kb.hasNext()) {
	    String[] inputSplitted = kb.nextLine().split("\t");
		String[] commentSplitted = inputSplitted[1].split(" ");

	    inputSplitted[1] = inputSplitted[1].toLowerCase();
	    char[] messageArray = inputSplitted[1].toCharArray();
	    String correctedMessage = "";

		if (commentSplitted.length > 100) {
			continue;
		}

	    if (commentSplitted.length > maxVectorLength) {
	    	maxVectorLength = commentSplitted.length;
		}

	    for (int i = 0; i < messageArray.length; i++) {
			if (messageArray[i] != ',' && messageArray[i] != '?' && messageArray[i] != '!' &&
		    	messageArray[i] != '.' && messageArray[i] != ':' && messageArray[i] != ';') {
		    	correctedMessage += messageArray[i];
			}
	    }

	    inputSplitted[1] = correctedMessage;

	    String addValue = "";

	    for (int i = 0; i < inputSplitted.length; i++) {
		addValue += inputSplitted[i];
			if (i < inputSplitted.length - 1) {
		    	addValue += "\t";
			}
	    }
	    
	    if (!kb.hasNext()) {
			fileWriter.write(addValue);
		}
	    else {
			fileWriter.write(addValue + "\r\n");
		}
	}

	fileWriter.close();
	System.out.println("Max Vector Length: " + maxVectorLength);
    }


}
