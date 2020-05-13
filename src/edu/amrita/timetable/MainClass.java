package edu.amrita.timetable;
import org.optaplanner.core.api.solver.Solver;
import org.optaplanner.core.api.solver.SolverFactory;
import java.util.*;
public class MainClass {

	public static void main(String[] args) 
	{
		if(LoadFromDB.Load())
		{
			SolverFactory<edu.amrita.timetable.Solver> solverFactory = SolverFactory.createFromXmlResource("edu/amrita/timetable/resources/xml/OptaPlannerConfig.xml");
			Solver<edu.amrita.timetable.Solver> solver = solverFactory.buildSolver();
			edu.amrita.timetable.Solver problem=new edu.amrita.timetable.Solver();
			problem.leclst=MapClass.SolutionLectureMap.get(4);
			edu.amrita.timetable.Solver solution=solver.solve(problem);
			System.out.println(solution.getScore().toString());
			System.out.println("🕉️Solved🕉️");
			{
				Map<Integer,Lecture> LectureMap=new TreeMap<Integer, Lecture>();
				for(Lecture l:solution.leclst)
				{
					LectureMap.put(l.id,l);
				}
				for(Lecture l:solution.leclst)
				{
					if(l.Parent != null)
					{
						l.TimeSlot = LectureMap.get(l.Parent).TimeSlot;
						l.Day = LectureMap.get(l.Parent).Day;
					}
				}
			}
			LoadFromDB.store(solution);
			System.out.println("🕉️Success🕉️");
		}
	}

}
