package edu.amrita.timetable;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;

public class MainClass {

	public static void main(String[] args) 
	{
		LoadFromDB.Load();
		SolverFactory<edu.amrita.timetable.Solver> solverFactory = SolverFactory.createFromXmlResource("edu/amrita/timetable/resources/xml/OptaPlannerConfig.xml");
		Solver<edu.amrita.timetable.Solver> solver = solverFactory.buildSolver();
		edu.amrita.timetable.Solver problem=new edu.amrita.timetable.Solver();
		problem.leclst=MapClass.LectureList;
		edu.amrita.timetable.Solver solution=solver.solve(problem);
		LoadFromDB.store(solution);
		System.out.println("🕉️Success🕉️");
	}

}
