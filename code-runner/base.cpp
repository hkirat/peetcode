#include <iostream>
#include <fstream>
#include <string>
#include <cstdlib>

std::string escapeSpecialChars(const std::string &input)
{
    std::string output;
    for (char c : input)
    {
        switch (c)
        {
        case '\\':
            output += "\\\\";
            break;
        case '\"':
            output += "\\\"";
            break;
        case '\b':
            output += "\\b";
            break;
        case '\f':
            output += "\\f";
            break;
        case '\n':
            output += "\\n";
            break;
        case '\r':
            output += "\\r";
            break;
        case '\t':
            output += "\\t";
            break;
        default:
            output += c;
            break;
        }
    }
    return output;
}

int main()
{
    const std::string codeFile = "code.cpp";
    const std::string executable = "code";
    const std::string actualOutputFile = "output.txt";

    std::string errorLog;

    // Compile the code file
    if (std::system(("g++ " + codeFile + " -o " + executable + " 2> " + actualOutputFile).c_str()) != 0)
    {
        std::ifstream errorLogFile(actualOutputFile);
        std::string line;
        while (std::getline(errorLogFile, line))
        {
            errorLog += line;
        }
        errorLogFile.close();

        std::ofstream output(actualOutputFile);
        output << "{\"success\":false,\"errorType\":\"Compilation Error\",\"output\":\"" << escapeSpecialChars(errorLog) << "\"}" << std::endl;
        return 0;
    }

    // Run the code
    if (std::system(("./" + executable + " > " + actualOutputFile + " 2>&1").c_str()) != 0)
    {
        std::ifstream errorLogFile(actualOutputFile);
        std::string line;
        while (std::getline(errorLogFile, line))
        {
            errorLog += line;
        }
        errorLogFile.close();

        std::ofstream output(actualOutputFile);
        output << "{\"success\":false,\"errorType\":\"Runtime Error\",\"output\":\"" << escapeSpecialChars(errorLog) << "\"}" << std::endl;
        return 0;
    }

    // Code executed successfully
    std::ifstream codeOutput(actualOutputFile);
    std::string outputString((std::istreambuf_iterator<char>(codeOutput)), std::istreambuf_iterator<char>());
    codeOutput.close();

    std::ofstream output(actualOutputFile);
    output << "{\"success\":true,\"output\":\"" << escapeSpecialChars(outputString) << "\"}" << std::endl;

    std::system("cat output.txt");

    return 0;
}
